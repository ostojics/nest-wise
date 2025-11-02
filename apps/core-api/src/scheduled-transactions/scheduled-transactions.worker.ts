import {Processor, WorkerHost} from '@nestjs/bullmq';
import {Injectable} from '@nestjs/common';
import {Job} from 'bullmq';
import {Logger} from 'pino-nestjs';
import {Queues} from '../common/enums/queues.enum';
import {ScheduledTransactionJobs} from '../common/enums/jobs.enum';
import {ScheduledTransactionsRepository} from './scheduled-transactions.repository';
import {TransactionsService} from '../transactions/transactions.service';
import {TransactionType} from '../common/enums/transaction.type.enum';
import {DataSource} from 'typeorm';
import {parseISO} from 'date-fns';
import {ScheduledTransactionExecution} from './scheduled-transaction-execution.entity';
import {Account} from 'src/accounts/account.entity';
import {Transaction} from 'src/transactions/transaction.entity';

interface CreateTransactionJobData {
  ruleId: string;
  executionDate: string;
}

@Processor(Queues.SCHEDULED_TRANSACTIONS, {
  concurrency: 5,
})
@Injectable()
export class ScheduledTransactionsWorker extends WorkerHost {
  constructor(
    private readonly repository: ScheduledTransactionsRepository,
    private readonly transactionsService: TransactionsService,
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
  ) {
    super();
  }

  async process(job: Job<CreateTransactionJobData>): Promise<void> {
    const jobName = String(job.name);
    if (jobName === String(ScheduledTransactionJobs.CREATE_TRANSACTION)) {
      await this.processCreateTransaction(job);
    }
  }

  private async processCreateTransaction(job: Job<CreateTransactionJobData>): Promise<void> {
    const {ruleId, executionDate} = job.data;

    this.logger.debug('Processing scheduled transaction creation', {
      jobId: job.id,
      ruleId,
      executionDate,
    });

    try {
      const rule = await this.repository.findById(ruleId);
      if (!rule) {
        this.logger.error('Rule not found for job', {ruleId, jobId: job.id});
        throw new Error(`Rule ${ruleId} not found`);
      }

      const transactionDate = parseISO(executionDate);

      await this.dataSource.transaction(async (manager) => {
        const executionsRepo = manager.getRepository(ScheduledTransactionExecution);
        const existingExecution = await executionsRepo.findOne({
          where: {
            ruleId: rule.id,
            executionDate: transactionDate,
          },
        });

        if (existingExecution) {
          this.logger.debug('Execution already exists for this rule and date (idempotent retry)', {
            jobId: job.id,
            ruleId,
            executionDate,
          });
          return; // Job succeeds without creating duplicate
        }

        // Create execution record
        const execution = executionsRepo.create({
          ruleId: rule.id,
          executionDate: transactionDate,
          transactionId: null,
        });
        await executionsRepo.save(execution);

        this.logger.debug('Created execution record', {
          ruleId,
          executionDate,
        });

        // Create the transaction
        const transactionData = {
          householdId: rule.householdId,
          accountId: rule.accountId,
          categoryId: rule.categoryId,
          type: rule.type,
          amount: Number(rule.amount),
          description: rule.description,
          transactionDate: transactionDate,
          isReconciled: false,
        };

        const transactionsRepo = manager.getRepository(Transaction);
        const transaction = transactionsRepo.create(transactionData) as {id: string};
        await transactionsRepo.save(transaction);

        this.logger.debug('Successfully created scheduled transaction', {
          jobId: job.id,
          ruleId,
          transactionId: transaction.id,
          executionDate,
        });

        // Update execution record with transaction ID
        await executionsRepo.update({ruleId: rule.id, executionDate: transactionDate}, {transactionId: transaction.id});

        // Update account balance
        const accountsRepo = manager.getRepository(Account);
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

        await this.repository.resetFailureCount(rule.id);
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      this.logger.error('Failed to create scheduled transaction', {
        jobId: job.id,
        ruleId,
        executionDate,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });

      await this.repository.incrementFailureCount(ruleId, errorMessage);

      throw error;
    }
  }
}
