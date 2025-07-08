import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {LoggerModule} from 'pino-nestjs';
import {ConfigModule, ConfigService} from '@nestjs/config';

import {ThrottlerModule} from '@nestjs/throttler';
import {throttlerConfig, throttlerFactory} from './config/throttler.config';
import {appConfig} from './config/app.config';
import {DatabaseConfig, databaseConfig, DatabaseConfigName} from './config/database.config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {GlobalConfig} from './config/config.type';
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({cache: true, load: [appConfig, throttlerConfig, databaseConfig]}),
    LoggerModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: throttlerFactory(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<GlobalConfig>) => {
        const config = configService.getOrThrow<DatabaseConfig>(DatabaseConfigName);

        return {
          ...config,
        };
      },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
