import {Module} from '@nestjs/common';
import {EmailsService} from './emails.service';
import {EmailsController} from './emails.controller';
import {ConfigModule} from '@nestjs/config';
import {BullModule} from '@nestjs/bullmq';
import {Queues} from 'src/common/enums/queues.enum';
import {EmailsConsumer} from './emails.consumer';
import {EmailProviderModule} from '../infrastructure/providers/email/email-provider.module';

@Module({
  imports: [ConfigModule, BullModule.registerQueue({name: Queues.EMAILS}), EmailProviderModule],
  controllers: [EmailsController],
  providers: [EmailsService, EmailsConsumer],
  exports: [EmailsService],
})
export class EmailsModule {}
