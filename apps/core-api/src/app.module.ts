import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {LoggerModule} from 'pino-nestjs';
import {ConfigModule, ConfigService} from '@nestjs/config';

import {ThrottlerModule} from '@nestjs/throttler';
import {throttlerConfig, throttlerFactory} from './config/throttler.config';
import {AppConfig, appConfig, AppConfigName} from './config/app.config';
import {DatabaseConfig, databaseConfig, DatabaseConfigName} from './config/database.config';
import {posthogConfig} from './config/posthog.config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {GlobalConfig} from './config/config.interface';
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import {HouseholdsModule} from './households/households.module';
import {AccountsModule} from './accounts/accounts.module';
import {CategoriesModule} from './categories/categories.module';
import {TransactionsModule} from './transactions/transactions.module';
import {EmailsModule} from './emails/emails.module';
import {BullModule} from '@nestjs/bullmq';
import {queuesConfig, QueuesConfig, QueuesConfigName} from './config/queues.config';
import {PoliciesModule} from './policies/policies.module';
import {ScheduleModule} from '@nestjs/schedule';
import {CategoryBudgetsModule} from './category-budgets/category-budgets.module';
import {PrivateTransactionsModule} from './private-transactions/private-transactions.module';
import {InvitesModule} from './invites/invites.module';
import {LicensesModule} from './licenses/licenses.module';
import {ScheduledTransactionsModule} from './scheduled-transactions/scheduled-transactions.module';
import {PosthogModule} from './lib/posthog/posthog.module';
import {ShutdownModule} from './lib/shutdown/shutdown.module';
import {UserPreferencesModule} from './user-preferences/user-preferences.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [appConfig, throttlerConfig, databaseConfig, queuesConfig, posthogConfig],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<GlobalConfig>) => {
        const config = configService.getOrThrow<AppConfig>(AppConfigName);

        return {
          pinoHttp: {
            level: config.logLevel,
          },
        };
      },
    }),
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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<GlobalConfig>) => {
        const config = configService.getOrThrow<QueuesConfig>(QueuesConfigName);

        return {
          connection: {
            host: config.redisHost,
            port: config.redisPort,

            password: config.redisPassword ?? undefined,
          },
          defaultJobOptions: {
            removeOnComplete: {age: 3600, count: 1000}, // Keep last 1000 or 1 hour
            removeOnFail: {age: 172800}, // Keep failed jobs for 48 hours (172800 seconds)
          },
        };
      },
    }),
    ScheduleModule.forRoot(),
    PosthogModule,
    ShutdownModule,
    AuthModule,
    UsersModule,
    HouseholdsModule,
    AccountsModule,
    CategoriesModule,
    TransactionsModule,
    EmailsModule,
    PoliciesModule,
    CategoryBudgetsModule,
    PrivateTransactionsModule,
    InvitesModule,
    LicensesModule,
    ScheduledTransactionsModule,
    UserPreferencesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
