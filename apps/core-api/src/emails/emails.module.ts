import {Module} from '@nestjs/common';
import {EmailsService} from './emails.service';
import {EmailsController} from './emails.controller';
import {ConfigModule} from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [EmailsController],
  providers: [EmailsService],
})
export class EmailsModule {}
