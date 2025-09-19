import {UTCDate} from '@date-fns/utc';
import {TransactionType} from '@maya-vault/contracts';
import {InjectQueue} from '@nestjs/bullmq';
import {Injectable} from '@nestjs/common';
import {Cron} from '@nestjs/schedule';
import {Job, Queue} from 'bullmq';
import {endOfMonth, format, startOfMonth, subMonths} from 'date-fns';
import {SavingsJobs} from 'src/common/enums/jobs.enum';
import {Queues} from 'src/common/enums/queues.enum';
import {CalculateSavingsPayload} from 'src/common/interfaces/savings.interfaces';
import {SavingsTrendPointContract} from '@maya-vault/contracts';
import {HouseholdsService} from 'src/households/households.service';
import {TransactionsService} from 'src/transactions/transactions.service';
import {Savings} from './savings.entity';
import {SavingsRepository} from './savings.repository';
import {Logger} from 'pino-nestjs';

@Injectable()
export class SavingsService {
  constructor(
    @InjectQueue(Queues.SAVINGS) private savingsQueue: Queue,
    private readonly householdsService: HouseholdsService,
    private readonly transactionsService: TransactionsService,
    private readonly savingsRepository: SavingsRepository,
    private readonly logger: Logger,
  ) {}

  @Cron('1 0 1 * *', {
    timeZone: 'UTC',
  })
  async calculateSavingsSchedule() {
    const households = await this.householdsService.findAllHouseholds();
    const jobsPromises: Promise<Job>[] = [];

    for (const household of households) {
      jobsPromises.push(
        this.savingsQueue.add(SavingsJobs.CALCULATE_SAVINGS, {
          householdId: household.id,
        }),
      );
    }

    await Promise.all(jobsPromises);
  }

  async create(savingsData: Partial<Savings>): Promise<Savings> {
    return await this.savingsRepository.create(savingsData);
  }

  async calculateSavings(payload: CalculateSavingsPayload) {
    try {
      const currentUTCDate = new UTCDate();
      const dateFormat = 'yyyy-MM-dd';
      const prevMonth = subMonths(currentUTCDate, 1);
      const prevMonthStart = startOfMonth(prevMonth);
      const prevMonthEnd = endOfMonth(prevMonth);
      this.logger.debug('Calculated months for savings calculation', {
        prevMonthStart,
        prevMonthEnd,
        prevMonth,
        currentUTCDate,
        householdId: payload.householdId,
      });

      const household = await this.householdsService.findHouseholdById(payload.householdId);

      const transactions = await this.transactionsService.findAllTransactions({
        transactionDate_from: format(prevMonthStart, dateFormat),
        transactionDate_to: format(prevMonthEnd, dateFormat),
        householdId: payload.householdId,
        type: TransactionType.EXPENSE,
      });

      const totalExpenses = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
      const monthlySpendingTarget = household.monthlyBudget;
      const savings = Math.max(0, monthlySpendingTarget - totalExpenses);

      await this.create({
        householdId: payload.householdId,
        amount: savings,
        month: format(prevMonth, 'MMM'),
      });

      this.logger.debug('Savings calculated successfully for household', {
        savings,
        monthlySpendingTarget,
        totalExpenses,
        prevMonth,
        prevMonthStart,
        householdId: payload.householdId,
      });
    } catch (error) {
      this.logger.error('Failed to calculate savings', error);
      throw error;
    }
  }

  async getSavingsTrend(householdId: string): Promise<SavingsTrendPointContract[]> {
    return await this.savingsRepository.getSavingsTrendForHousehold(householdId);
  }
}
