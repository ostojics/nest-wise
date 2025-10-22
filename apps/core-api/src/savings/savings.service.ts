import {TransactionType} from '@nest-wise/contracts';
import {InjectQueue} from '@nestjs/bullmq';
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Cron} from '@nestjs/schedule';
import {Job, Queue} from 'bullmq';
import {format} from 'date-fns';
import {SavingsJobs} from 'src/common/enums/jobs.enum';
import {Queues} from 'src/common/enums/queues.enum';
import {CalculateSavingsPayload} from 'src/common/interfaces/savings.interfaces';
import {SavingsTrendPointContract} from '@nest-wise/contracts';
import {HouseholdsService} from 'src/households/households.service';
import {TransactionsService} from 'src/transactions/transactions.service';
import {Savings} from './savings.entity';
import {SavingsRepository} from './savings.repository';
import {Logger} from 'pino-nestjs';
import {AppConfig, AppConfigName} from 'src/config/app.config';
import {formatDateInTimezone, getPreviousMonthBoundaries} from 'src/common/utils/date.utils';
import {GlobalConfig} from 'src/config/config.interface';

@Injectable()
export class SavingsService {
  private readonly timezone: string;

  constructor(
    @InjectQueue(Queues.SAVINGS) private savingsQueue: Queue,
    private readonly householdsService: HouseholdsService,
    private readonly transactionsService: TransactionsService,
    private readonly savingsRepository: SavingsRepository,
    private readonly logger: Logger,
    private readonly configService: ConfigService<GlobalConfig>,
  ) {
    const appConfig = this.configService.getOrThrow<AppConfig>(AppConfigName);
    this.timezone = appConfig.timezone;
  }

  @Cron('5 0 1 * *', {
    timeZone: 'UTC',
  })
  async calculateSavingsSchedule() {
    // Get previous month boundaries in the app timezone
    const {periodYm} = getPreviousMonthBoundaries(this.timezone);

    this.logger.debug('Starting scheduled savings calculation', {
      periodYm,
      timezone: this.timezone,
    });

    const households = await this.householdsService.findAllHouseholds();
    const jobsPromises: Promise<Job>[] = [];

    for (const household of households) {
      // Use deterministic jobId to ensure idempotency
      const jobId = `calc-savings-${household.id}-${periodYm}`;

      jobsPromises.push(
        this.savingsQueue.add(
          SavingsJobs.CALCULATE_SAVINGS,
          {
            householdId: household.id,
          },
          {
            jobId,
          },
        ),
      );
    }

    await Promise.all(jobsPromises);

    this.logger.debug('Scheduled savings calculation jobs enqueued', {
      periodYm,
      householdCount: households.length,
    });
  }

  async create(savingsData: Partial<Savings>): Promise<Savings> {
    return await this.savingsRepository.create(savingsData);
  }

  async calculateSavings(payload: CalculateSavingsPayload) {
    try {
      // Get previous month boundaries in the app timezone
      const {previousMonthStart, previousMonthEnd, periodYm} = getPreviousMonthBoundaries(this.timezone);

      // Format dates for transaction filtering (YYYY-MM-DD in local timezone)
      const prevMonthStartStr = formatDateInTimezone(previousMonthStart, this.timezone);
      const prevMonthEndStr = formatDateInTimezone(previousMonthEnd, this.timezone);

      this.logger.debug('Calculating savings for household', {
        householdId: payload.householdId,
        periodYm,
        timezone: this.timezone,
        dateRange: {
          from: prevMonthStartStr,
          to: prevMonthEndStr,
        },
      });

      const household = await this.householdsService.findHouseholdById(payload.householdId);

      const transactions = await this.transactionsService.findAllTransactions({
        transactionDate_from: prevMonthStartStr,
        transactionDate_to: prevMonthEndStr,
        householdId: payload.householdId,
        type: TransactionType.EXPENSE,
      });

      const totalExpenses = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

      // monthlyBudget has a default value (5000) and is NOT NULL in DB, but we're defensive
      const monthlyBudget = household.monthlyBudget;
      const savings = Math.max(0, monthlyBudget - totalExpenses);

      // Generate human-readable month label (e.g., "Jan") for backward compatibility
      const monthLabel = format(previousMonthStart, 'MMM');

      await this.create({
        householdId: payload.householdId,
        amount: savings,
        month: monthLabel,
        periodYm,
      });

      this.logger.debug('Savings calculated successfully for household', {
        householdId: payload.householdId,
        periodYm,
        monthlyBudget,
        totalExpenses,
        savings,
        transactionCount: transactions.length,
      });
    } catch (error) {
      // Check if error is due to unique constraint violation (idempotency case)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === '23505' && error.constraint === 'savings_household_period_ym_unique') {
        this.logger.debug('Savings already calculated for household and period (idempotent)', {
          householdId: payload.householdId,
        });
        return;
      }

      this.logger.error('Failed to calculate savings', {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        error,
        householdId: payload.householdId,
      });
      throw error;
    }
  }

  async getSavingsTrend(householdId: string): Promise<SavingsTrendPointContract[]> {
    return await this.savingsRepository.getSavingsTrendForHousehold(householdId);
  }
}
