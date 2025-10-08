import {Processor, WorkerHost} from '@nestjs/bullmq';
import {Job} from 'bullmq';
import {EmailJobs} from 'src/common/enums/jobs.enum';
import {Queues} from 'src/common/enums/queues.enum';
import {
  SendInviteEmailPayload,
  SendPasswordResetEmailPayload,
  SendEmailChangeConfirmationPayload,
  SendHelpEmailPayload,
} from 'src/common/interfaces/emails.interface';
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
      case EmailJobs.SEND_EMAIL_CHANGE_CONFIRMATION: {
        await this.emailsService.processEmailChangeConfirmationJob(job.data as SendEmailChangeConfirmationPayload);
        break;
      }
      case EmailJobs.SEND_HELP_EMAIL: {
        await this.emailsService.processHelpEmailJob(job.data as SendHelpEmailPayload);
        break;
      }
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }
}
