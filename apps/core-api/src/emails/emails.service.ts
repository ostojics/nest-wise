import {AcceptInviteQueryParams} from '@nest-wise/contracts';
import {InjectQueue} from '@nestjs/bullmq';
import {Injectable, Inject} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {Queue} from 'bullmq';
import {Logger} from 'pino-nestjs';
import {EmailJobs} from 'src/common/enums/jobs.enum';
import {Queues} from 'src/common/enums/queues.enum';
import {
  SendInviteEmailPayload,
  SendPasswordResetEmailPayload,
  SendEmailChangeConfirmationPayload,
  SendHelpEmailPayload,
} from 'src/common/interfaces/emails.interface';
import {AppConfig, AppConfigName} from 'src/config/app.config';
import {IEmailProvider, EMAIL_PROVIDER} from 'src/domain/contracts/providers/email-provider.interface';

@Injectable()
export class EmailsService {
  private readonly webAppUrl: string;
  private readonly supportEmail: string;

  constructor(
    @InjectQueue(Queues.EMAILS) private emailsQueue: Queue,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
    @Inject(EMAIL_PROVIDER) private readonly emailProvider: IEmailProvider,
  ) {
    const config = this.configService.getOrThrow<AppConfig>(AppConfigName);
    this.webAppUrl = config.webAppUrl;
    this.supportEmail = config.supportEmail;
  }

  async sendInviteEmail(payload: SendInviteEmailPayload) {
    this.logger.log('Sending invite email event', payload);
    await this.emailsQueue.add(EmailJobs.SEND_INVITE_EMAIL, payload, {
      attempts: 1,
    });
  }

  async sendPasswordResetEmail(payload: SendPasswordResetEmailPayload) {
    this.logger.log('Sending password reset email event', payload);
    await this.emailsQueue.add(EmailJobs.SEND_PASSWORD_RESET_EMAIL, payload, {
      attempts: 1,
    });
  }

  async sendEmailChangeConfirmation(payload: SendEmailChangeConfirmationPayload) {
    this.logger.log('Sending email change confirmation event', payload);
    await this.emailsQueue.add(EmailJobs.SEND_EMAIL_CHANGE_CONFIRMATION, payload, {
      attempts: 1,
    });
  }
  async sendHelpEmail(payload: SendHelpEmailPayload) {
    this.logger.log('Sending help email event', payload);
    await this.emailsQueue.add(EmailJobs.SEND_HELP_EMAIL, payload, {
      attempts: 1,
    });
  }

  async processInviteEmailJob(payload: SendInviteEmailPayload) {
    const appConfig = this.configService.getOrThrow<AppConfig>(AppConfigName);
    const jwtPayload = {
      sub: payload.householdId,
      email: payload.email,
      iss: appConfig.url,
    };

    const token = await this.jwtService.signAsync(jwtPayload);

    await this.emailProvider.sendInviteEmail({
      to: payload.email,
      householdName: payload.householdName,
      inviteToken: token,
      webAppUrl: this.webAppUrl,
    });
  }

  async processPasswordResetEmailJob(payload: SendPasswordResetEmailPayload) {
    const appConfig = this.configService.getOrThrow<AppConfig>(AppConfigName);
    const jwtPayload = {
      sub: payload.userId,
      email: payload.email,
      iss: appConfig.url,
      purpose: 'password-reset',
    };

    const token = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '15m',
    });

    await this.emailProvider.sendPasswordResetEmail({
      to: payload.email,
      resetToken: token,
      webAppUrl: this.webAppUrl,
    });
  }

  async processEmailChangeConfirmationJob(payload: SendEmailChangeConfirmationPayload) {
    await this.emailProvider.sendEmailChangeConfirmation({
      to: payload.newEmail,
      confirmationToken: payload.token,
      webAppUrl: this.webAppUrl,
    });
  }

  async processHelpEmailJob(payload: SendHelpEmailPayload) {
    await this.emailProvider.sendHelpEmail({
      userEmail: payload.email,
      userId: payload.userId,
      message: payload.message,
      supportEmail: this.supportEmail,
    });
  }
}
