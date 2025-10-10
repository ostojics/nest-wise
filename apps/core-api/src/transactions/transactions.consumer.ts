import {Processor, WorkerHost} from '@nestjs/bullmq';
import {Job} from 'bullmq';
import {Queues} from 'src/common/enums/queues.enum';
import {ProcessAiTransactionPayload} from 'src/common/interfaces/ai-transactions.interface';
import {TransactionsService} from './transactions.service';
import {Logger} from 'pino-nestjs';

@Processor(Queues.AI_TRANSACTIONS)
export class TransactionsConsumer extends WorkerHost {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async process(job: Job) {
    const payload = job.data as ProcessAiTransactionPayload;
    this.logger.debug('Processing AI transaction job', {jobId: job.id, payload});

    try {
      const transaction = await this.transactionsService.createTransactionAiForHousehold(
        payload.householdId,
        payload.transactionData,
      );

      this.logger.debug('AI transaction job completed successfully', {
        jobId: job.id,
        transactionId: transaction.id,
      });
      return transaction;
    } catch (error: unknown) {
      this.logger.error('AI transaction job failed', {
        jobId: job.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
}
