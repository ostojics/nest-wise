import {AcceptInviteQueryParams} from '@nest-wise/contracts';
import {InjectQueue} from '@nestjs/bullmq';
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {Queue} from 'bullmq';
import {Logger} from 'pino-nestjs';
import {Resend} from 'resend';
import {EmailJobs} from 'src/common/enums/jobs.enum';
import {Queues} from 'src/common/enums/queues.enum';
import {
  SendInviteEmailPayload,
  SendPasswordResetEmailPayload,
  SendEmailChangeConfirmationPayload,
} from 'src/common/interfaces/emails.interface';
import {AppConfig, AppConfigName} from 'src/config/app.config';

@Injectable()
export class EmailsService {
  private readonly resendClient: Resend;
  private readonly fromEmail: string;

  constructor(
    @InjectQueue(Queues.EMAILS) private emailsQueue: Queue,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
  ) {
    const config = this.configService.getOrThrow<AppConfig>(AppConfigName);
    this.resendClient = new Resend(config.resendApiKey);
    this.fromEmail = 'info@no-reply.nestwise.finance';
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
      email: payload.email,
    };
    const queryParams = new URLSearchParams(params).toString();

    const {error} = await this.resendClient.emails.send({
      to: payload.email,
      from: this.fromEmail,
      subject: `[NestWise] Poziv za pridruživanje domaćinstvu`,
      html: `
      <p>Pozvani ste da se pridružite domaćinstvu <b>${payload.householdName}</b> na NestWise platformi. Kliknite na link ispod da prihvatite poziv:</p>
      <a href="${webAppUrl}/invites?${queryParams}">Prihvati poziv</a>
      `,
    });

    if (error) {
      this.logger.error('Error sending invite email', error);
      throw new Error(error.message);
    }
  }

  async processPasswordResetEmailJob(payload: SendPasswordResetEmailPayload) {
    const {webAppUrl} = this.configService.getOrThrow<AppConfig>(AppConfigName);

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

    const params = new URLSearchParams({token});
    const queryParams = params.toString();

    const {error} = await this.resendClient.emails.send({
      to: payload.email,
      from: this.fromEmail,
      subject: `[NestWise] Resetovanje lozinke`,
      html: `
      <p>Zatražili ste resetovanje lozinke za svoj NestWise nalog.</p>
      <p>Molimo kliknite na link ispod da resetujete lozinku. Ovaj link ističe za 15 minuta:</p>
      <a href="${webAppUrl}/reset-password?${queryParams}">Resetuj lozinku</a>
      <p>Ukoliko niste tražili resetovanje lozinke, slobodno ignorišite ovaj email.</p>
      `,
    });

    if (error) {
      this.logger.error('Error sending password reset email', error);
      throw new Error(error.message);
    }
  }

  async processEmailChangeConfirmationJob(payload: SendEmailChangeConfirmationPayload) {
    const {webAppUrl} = this.configService.getOrThrow<AppConfig>(AppConfigName);

    const params = new URLSearchParams({token: payload.token});
    const queryParams = params.toString();

    const {error} = await this.resendClient.emails.send({
      to: payload.newEmail,
      from: this.fromEmail,
      subject: `[NestWise] Potvrda promene e‑pošte`,
      html: `
      <p>Zatražili ste promenu e‑pošte za svoj NestWise nalog.</p>
      <p>Molimo kliknite na link ispod da potvrdite novu e‑poštu. Ovaj link ističe za 15 minuta:</p>
      <a href="${webAppUrl}/account/email-change?${queryParams}">Potvrdi promenu e‑pošte</a>
      <p>Ukoliko niste tražili promenu e‑pošte, slobodno ignorišite ovaj email.</p>
      `,
    });

    if (error) {
      this.logger.error('Error sending email change confirmation', error);
      throw new Error(error.message);
    }
  }
}
