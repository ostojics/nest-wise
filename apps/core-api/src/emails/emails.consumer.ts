/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import {Processor, WorkerHost} from '@nestjs/bullmq';
import {Job} from 'bullmq';
import {EmailJobs} from 'src/common/enums/jobs.enum';
import {Queues} from 'src/common/enums/queues.enum';
import {SendInviteEmailPayload, SendPasswordResetEmailPayload} from 'src/common/interfaces/emails.interface';
import {EmailsService} from './emails.service';

@Processor(Queues.EMAILS)
export class EmailsConsumer extends WorkerHost {
  constructor(private readonly emailsService: EmailsService) {
    super();
  }

  async process(job: Job) {
    switch (job.name as EmailJobs) {
      case EmailJobs.SEND_INVITE_EMAIL: {
        await this.emailsService.processInviteEmailJob(job.data as SendInviteEmailPayload);
        break;
      }
      case EmailJobs.SEND_PASSWORD_RESET_EMAIL: {
        await this.emailsService.processPasswordResetEmailJob(job.data as SendPasswordResetEmailPayload);
        break;
      }
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }
}
