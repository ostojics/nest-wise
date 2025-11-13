import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Logger} from 'pino-nestjs';
import {Resend} from 'resend';
import {
  IEmailProvider,
  SendInviteEmailRequest,
  SendPasswordResetEmailRequest,
  SendEmailChangeConfirmationRequest,
  SendHelpEmailRequest,
} from '../../../contracts/providers/email-provider.interface';
import {AppConfig, AppConfigName} from '../../../config/app.config';

/**
 * Resend implementation of the Email provider
 * Uses Resend API for sending emails
 */
@Injectable()
export class ResendEmailProvider implements IEmailProvider {
  private readonly resendClient: Resend;
  private readonly fromEmail: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    const config = this.configService.getOrThrow<AppConfig>(AppConfigName);
    this.resendClient = new Resend(config.resendApiKey);
    this.fromEmail = 'info@no-reply.nestwise.finance';
  }

  async sendInviteEmail(request: SendInviteEmailRequest): Promise<void> {
    const queryParams = new URLSearchParams({
      token: request.inviteToken,
      householdName: request.householdName,
      email: request.to,
    }).toString();

    const {error} = await this.resendClient.emails.send({
      to: request.to,
      from: this.fromEmail,
      subject: `[NestWise] Poziv za pridruživanje domaćinstvu`,
      html: `
      <p>Pozvani ste da se pridružite domaćinstvu <b>${request.householdName}</b> na NestWise platformi. Kliknite na link ispod da prihvatite poziv:</p>
      <a href="${request.webAppUrl}/invites?${queryParams}">Prihvati poziv</a>
      `,
    });

    if (error) {
      this.logger.error('Error sending invite email', {error});
      throw new Error(error.message);
    }
  }

  async sendPasswordResetEmail(request: SendPasswordResetEmailRequest): Promise<void> {
    const queryParams = new URLSearchParams({token: request.resetToken}).toString();

    const {error} = await this.resendClient.emails.send({
      to: request.to,
      from: this.fromEmail,
      subject: `[NestWise] Resetovanje lozinke`,
      html: `
      <p>Zatražili ste resetovanje lozinke za svoj NestWise nalog.</p>
      <p>Molimo kliknite na link ispod da resetujete lozinku. Ovaj link ističe za 15 minuta:</p>
      <a href="${request.webAppUrl}/reset-password?${queryParams}">Resetuj lozinku</a>
      <p>Ukoliko niste tražili resetovanje lozinke, slobodno ignorišite ovaj email.</p>
      `,
    });

    if (error) {
      this.logger.error('Error sending password reset email', {error});
      throw new Error(error.message);
    }
  }

  async sendEmailChangeConfirmation(request: SendEmailChangeConfirmationRequest): Promise<void> {
    const queryParams = new URLSearchParams({token: request.confirmationToken}).toString();

    const {error} = await this.resendClient.emails.send({
      to: request.to,
      from: this.fromEmail,
      subject: `[NestWise] Potvrda promene e‑pošte`,
      html: `
      <p>Zatražili ste promenu e‑pošte za svoj NestWise nalog.</p>
      <p>Molimo kliknite na link ispod da potvrdite novu e‑poštu. Ovaj link ističe za 15 minuta:</p>
      <a href="${request.webAppUrl}/email-change?${queryParams}">Potvrdi promenu e‑pošte</a>
      <p>Ukoliko niste tražili promenu e‑pošte, slobodno ignorišite ovaj email.</p>
      `,
    });

    if (error) {
      this.logger.error('Error sending email change confirmation', {error});
      throw new Error(error.message);
    }
  }

  async sendHelpEmail(request: SendHelpEmailRequest): Promise<void> {
    const escapedMessage = request.message
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');

    const {error} = await this.resendClient.emails.send({
      to: request.supportEmail,
      from: this.fromEmail,
      subject: `[NestWise] Pomoć – korisnička poruka`,
      html: `
      <h3>Nova korisnička poruka</h3>
      <p><strong>Od:</strong> ${request.userEmail}</p>
      ${request.userId ? `<p><strong>ID korisnika:</strong> ${request.userId}</p>` : ''}
      <hr>
      <p><strong>Poruka:</strong></p>
      <p>${escapedMessage}</p>
      `,
    });

    if (error) {
      this.logger.error(`Error sending help email: ${error.message}`, {error});
      throw new Error(error.message);
    }
  }
}
