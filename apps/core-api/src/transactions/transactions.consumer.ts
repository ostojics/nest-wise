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
    this.logger.debug('Processing AI transaction suggestion job', {jobId: job.id, payload});

    try {
      const suggestion = await this.transactionsService.generateAiTransactionSuggestion(
        payload.householdId,
        payload.transactionData,
      );

      this.logger.debug('AI transaction suggestion job completed successfully', {
        jobId: job.id,
        suggestion,
      });
      return suggestion;
    } catch (error: unknown) {
      this.logger.error('AI transaction suggestion job failed', {
        jobId: job.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
}
