import {Processor, WorkerHost} from '@nestjs/bullmq';
import {Injectable} from '@nestjs/common';
import {Job} from 'bullmq';
import {ConfigService} from '@nestjs/config';
import {Logger} from 'pino-nestjs';
import {Queues} from '../common/enums/queues.enum';
import {ScheduledTransactionJobs} from '../common/enums/jobs.enum';
import {ScheduledTransactionsRepository} from './scheduled-transactions.repository';
import {TransactionsService} from '../transactions/transactions.service';
import {createTimestampInTimezone, parseLocalDate} from './date.util';
import {AppConfig, AppConfigName} from '../config/app.config';
import {TransactionType} from '../common/enums/transaction.type.enum';
import {DataSource} from 'typeorm';

interface CreateTransactionJobData {
  ruleId: string;
  localDate: string;
}

@Processor(Queues.SCHEDULED_TRANSACTIONS, {
  concurrency: 5, // Process multiple transaction creation jobs in parallel
})
@Injectable()
export class ScheduledTransactionsWorker extends WorkerHost {
  private readonly appTimezone: string;

  constructor(
    private readonly repository: ScheduledTransactionsRepository,
    private readonly transactionsService: TransactionsService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
  ) {
    super();
    const appConfig = this.configService.getOrThrow<AppConfig>(AppConfigName);
    this.appTimezone = appConfig.timezone;
  }

  async process(job: Job<CreateTransactionJobData>): Promise<void> {
    const jobName = String(job.name);
    if (jobName === String(ScheduledTransactionJobs.CREATE_TRANSACTION)) {
      await this.processCreateTransaction(job);
    }
  }

  private async processCreateTransaction(job: Job<CreateTransactionJobData>): Promise<void> {
    const {ruleId, localDate} = job.data;

    this.logger.debug('Processing scheduled transaction creation', {
      jobId: job.id,
      ruleId,
      localDate,
    });

    try {
      // Fetch the rule
      const rule = await this.repository.findById(ruleId);
      if (!rule) {
        this.logger.error('Rule not found', {ruleId});
        throw new Error(`Rule ${ruleId} not found`);
      }

      // Compute the posted timestamp (local date + posted time → UTC)
      const postedAt = createTimestampInTimezone(localDate, rule.postedTimeLocal, this.appTimezone);
      const scheduledLocalDate = parseLocalDate(localDate);

      // Use a database transaction to ensure atomicity
      await this.dataSource.transaction(async (manager) => {
        // Create the transaction using the TransactionsService
        // We pass the scheduled metadata in the data
        const transactionData = {
          householdId: rule.householdId,
          accountId: rule.accountId,
          categoryId: rule.categoryId,
          type: rule.type,
          amount: Number(rule.amount),
          description: rule.description,
          transactionDate: postedAt,
          isReconciled: false,
          scheduledRuleId: rule.id,
          scheduledLocalDate: scheduledLocalDate,
        };

        // Call the repository directly within the transaction
        const transactionsRepo = manager.getRepository('transactions');

        try {
          const transaction = transactionsRepo.create(transactionData) as {id: string};
          await transactionsRepo.save(transaction);

          this.logger.debug('Successfully created scheduled transaction', {
            jobId: job.id,
            ruleId,
            transactionId: transaction.id,
            localDate,
          });

          // Update account balance
          const accountsRepo = manager.getRepository('accounts');
          const account = (await accountsRepo.findOne({where: {id: rule.accountId}})) as {
            id: string;
            currentBalance: string | number;
          } | null;

          if (account) {
            let newBalance = Number(account.currentBalance);
            if (rule.type === TransactionType.INCOME) {
              newBalance += Number(rule.amount);
            } else {
              newBalance -= Number(rule.amount);
            }

            await accountsRepo.update(rule.accountId, {currentBalance: newBalance});

            this.logger.debug('Updated account balance', {
              accountId: rule.accountId,
              oldBalance: account.currentBalance,
              newBalance,
            });
          }

          // Reset failure count on success
          await this.repository.resetFailureCount(rule.id);
        } catch (error: unknown) {
          // Check if this is a unique constraint violation
          if (
            error &&
            typeof error === 'object' &&
            'code' in error &&
            error.code === '23505' &&
            'constraint' in error &&
            error.constraint === 'transactions_scheduled_rule_local_date_unique_idx'
          ) {
            // This is expected for idempotent retries - log and treat as success
            this.logger.debug('Transaction already exists for this rule and date (idempotent retry)', {
              jobId: job.id,
              ruleId,
              localDate,
            });
            return; // Do not throw, job succeeds
          }

          // For other errors, propagate
          throw error;
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      this.logger.error('Failed to create scheduled transaction', {
        jobId: job.id,
        ruleId,
        localDate,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Increment failure count
      await this.repository.incrementFailureCount(ruleId, errorMessage);

      // Re-throw to let BullMQ handle retry
      throw error;
    }
  }
}
