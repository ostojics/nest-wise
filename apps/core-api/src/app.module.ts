import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {LoggerModule} from 'pino-nestjs';
import {ConfigModule, ConfigService} from '@nestjs/config';

import {ThrottlerModule} from '@nestjs/throttler';
import {throttlerConfig, throttlerFactory} from './config/throttler.config';
import {appConfig} from './config/app.config';
import {databaseConfig} from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({cache: true, load: [appConfig, throttlerConfig, databaseConfig]}),
    LoggerModule.forRoot(),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: throttlerFactory(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
