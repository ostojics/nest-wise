import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {ResendEmailProvider} from './resend.provider';
import {EMAIL_PROVIDER} from '../../../domain/contracts/providers/email-provider.interface';

/**
 * Email Provider Module
 * Provides email sending capabilities with pluggable providers
 */
@Module({
  imports: [ConfigModule],
  providers: [
    ResendEmailProvider,
    {
      provide: EMAIL_PROVIDER,
      useExisting: ResendEmailProvider,
    },
  ],
  exports: [EMAIL_PROVIDER],
})
export class EmailProviderModule {}
