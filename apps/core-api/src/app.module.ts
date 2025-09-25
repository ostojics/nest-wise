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
import {SavingsModule} from './savings/savings.module';
import {CategoryBudgetsModule} from './category-budgets/category-budgets.module';
import {PrivateTransactionsModule} from './private-transactions/private-transactions.module';
import {InvitesModule} from './invites/invites.module';
import {LicensesModule} from './licenses/licenses.module';

@Module({
  imports: [
    ConfigModule.forRoot({cache: true, load: [appConfig, throttlerConfig, databaseConfig, queuesConfig]}),
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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<GlobalConfig>) => {
        const config = configService.getOrThrow<QueuesConfig>(QueuesConfigName);

        return {
          connection: {
            host: config.redisHost,
            port: config.redisPort,
            password: config.redisPassword,
          },
        };
      },
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    HouseholdsModule,
    AccountsModule,
    CategoriesModule,
    TransactionsModule,
    EmailsModule,
    PoliciesModule,
    SavingsModule,
    CategoryBudgetsModule,
    PrivateTransactionsModule,
    InvitesModule,
    LicensesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
