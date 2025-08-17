import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {CreateEmailOptions, Resend} from 'resend';
import {AppConfig, AppConfigName} from 'src/config/app.config';

@Injectable()
export class EmailsService {
  constructor(private readonly configService: ConfigService) {}

  async sendEmail(payload: CreateEmailOptions) {
    const {resendApiKey} = this.configService.getOrThrow<AppConfig>(AppConfigName);
    const resend = new Resend(resendApiKey);

    const {error} = await resend.emails.send(payload);
    if (error) {
      throw new Error(error.message);
    }
  }
}
