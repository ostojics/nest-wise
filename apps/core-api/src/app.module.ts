import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {LoggerModule} from 'pino-nestjs';
import {ConfigModule} from '@nestjs/config';
import appConfig from './config/app.config';

@Module({
  imports: [ConfigModule.forRoot({cache: true, load: [appConfig]}), LoggerModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
