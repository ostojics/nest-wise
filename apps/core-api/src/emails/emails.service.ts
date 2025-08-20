import {AcceptInviteQueryParams} from '@maya-vault/contracts';
import {InjectQueue} from '@nestjs/bullmq';
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {Queue} from 'bullmq';
import {Logger} from 'pino-nestjs';
import {Resend} from 'resend';
import {EmailJobs} from 'src/common/enums/jobs.enum';
import {Queues} from 'src/common/enums/queues.enum';
import {SendInviteEmailPayload} from 'src/common/interfaces/emails.interface';
import {AppConfig, AppConfigName} from 'src/config/app.config';

@Injectable()
export class EmailsService {
  private readonly resendClient: Resend;

  constructor(
    @InjectQueue(Queues.EMAILS) private emailsQueue: Queue,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
  ) {
    const config = this.configService.getOrThrow<AppConfig>(AppConfigName);
    this.resendClient = new Resend(config.resendApiKey);
  }

  async sendInviteEmail(payload: SendInviteEmailPayload) {
    this.logger.log('Sending invite email event', payload);
    await this.emailsQueue.add(EmailJobs.SEND_INVITE_EMAIL, payload, {
      attempts: 1,
    });
  }

  async processInviteEmailJob(payload: SendInviteEmailPayload) {
    const {webAppUrl} = this.configService.getOrThrow<AppConfig>(AppConfigName);

    const appConfig = this.configService.getOrThrow<AppConfig>(AppConfigName);
    const jwtPayload = {
      sub: payload.householdId,
      email: payload.email,
      iss: appConfig.url,
    };

    const token = await this.jwtService.signAsync(jwtPayload);
    const params: AcceptInviteQueryParams = {
      token,
      householdName: payload.householdName,
    };
    const queryParams = new URLSearchParams(params).toString();

    const {error} = await this.resendClient.emails.send({
      to: payload.email,
      from: 'no-reply@resend.dev',
      subject: `[Maya Vault] Invitation to join household`,
      html: `
      <p>You have been invited to join household <b>${payload.householdName}</b> on Maya Vault. Please click the link below to accept the invitation:</p>
      <a href="${webAppUrl}/invites?${queryParams}">Accept Invitation</a>
      `,
    });

    if (error) {
      this.logger.error('Error sending invite email', error);
      throw new Error(error.message);
    }
  }
}
