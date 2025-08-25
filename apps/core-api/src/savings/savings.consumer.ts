/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import {Processor, WorkerHost} from '@nestjs/bullmq';
import {Job} from 'bullmq';
import {SavingsJobs} from 'src/common/enums/jobs.enum';
import {Queues} from 'src/common/enums/queues.enum';
import {SavingsService} from './savings.service';
import {CalculateSavingsPayload} from 'src/common/interfaces/savings.interfaces';

@Processor(Queues.SAVINGS)
export class SavingsConsumer extends WorkerHost {
  constructor(private readonly savingsService: SavingsService) {
    super();
  }

  async process(job: Job) {
    switch (job.name as SavingsJobs) {
      case SavingsJobs.CALCULATE_SAVINGS: {
        await this.savingsService.calculateSavings(job.data as CalculateSavingsPayload);
        break;
      }
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }
}
