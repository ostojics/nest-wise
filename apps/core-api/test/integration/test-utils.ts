import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {JwtModule} from '@nestjs/jwt';
import {DataSource} from 'typeorm';
import {Logger} from 'pino-nestjs';
import {User} from '../../src/users/user.entity';
import {Household} from '../../src/households/household.entity';
import {License} from '../../src/licenses/license.entity';
import {Account} from '../../src/accounts/account.entity';
import {Category} from '../../src/categories/categories.entity';
import {Transaction} from '../../src/transactions/transaction.entity';
import {CategoryBudget} from '../../src/category-budgets/category-budgets.entity';
import {PrivateTransaction} from '../../src/private-transactions/private-transactions.entity';
import {ScheduledTransactionRule} from '../../src/scheduled-transactions/scheduled-transaction-rule.entity';
import {AccountsService} from '../../src/accounts/accounts.service';
import {CategoriesService} from '../../src/categories/categories.service';
import {EmailsService} from '../../src/emails/emails.service';
import {appConfig, AppConfig, AppConfigName} from '../../src/config/app.config';
import {databaseConfig, DatabaseConfig, DatabaseConfigName} from '../../src/config/database.config';
import {queuesConfig} from '../../src/config/queues.config';
import {throttlerConfig} from '../../src/config/throttler.config';
import {GlobalConfig} from '../../src/config/config.interface';

/**
 * Common entities used across integration tests
 */
export const INTEGRATION_TEST_ENTITIES = [
  User,
  Household,
  License,
  Account,
  Category,
  Transaction,
  CategoryBudget,
  PrivateTransaction,
  ScheduledTransactionRule,
];

/**
 * Returns the ConfigModule configuration for integration tests
 */
export function getConfigModuleConfig() {
  return ConfigModule.forRoot({
    cache: true,
    load: [appConfig, throttlerConfig, databaseConfig, queuesConfig],
  });
}

/**
 * Returns the TypeOrmModule configuration for integration tests
 */
export function getTypeOrmModuleConfig() {
  return TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService<GlobalConfig>) => {
      const config = configService.getOrThrow<DatabaseConfig>(DatabaseConfigName);
      return {
        ...config,
      };
    },
  });
}

/**
 * Returns the JwtModule configuration for integration tests
 */
export function getJwtModuleConfig() {
  return JwtModule.registerAsync({
    useFactory: (configService: ConfigService) => {
      const appConfig = configService.getOrThrow<AppConfig>(AppConfigName);

      return {
        secret: appConfig.jwtSecret,
        signOptions: {expiresIn: '7d'},
      };
    },
    global: true,
    imports: [ConfigModule],
    inject: [ConfigService],
  });
}

/**
 * Mock AccountsService provider for integration tests
 */
export const mockAccountsServiceProvider = {
  provide: AccountsService,
  useValue: {
    findAccountsByHouseholdId: jest.fn().mockResolvedValue([]),
  },
};

/**
 * Mock CategoriesService provider for integration tests
 */
export const mockCategoriesServiceProvider = {
  provide: CategoriesService,
  useValue: {
    findCategoriesByHouseholdId: jest.fn().mockResolvedValue([]),
  },
};

/**
 * Mock EmailsService provider for integration tests
 */
export const mockEmailsServiceProvider = {
  provide: EmailsService,
  useValue: {
    sendEmail: jest.fn().mockResolvedValue(undefined),
    sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
  },
};

/**
 * Mock Logger provider for integration tests
 */
export const mockLoggerProvider = {
  provide: Logger,
  useValue: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  },
};

/**
 * Cleans up test data from database tables
 * @param dataSource TypeORM DataSource instance
 * @param entities List of entity classes to clean up (defaults to User, Household, License)
 */
export async function cleanupTestData(
  dataSource: DataSource,
  entities: Array<
    | typeof User
    | typeof Household
    | typeof License
    | typeof Account
    | typeof Transaction
    | typeof Category
    | typeof CategoryBudget
    | typeof PrivateTransaction
  > = [User, Household, License],
) {
  for (const entity of entities) {
    await dataSource.getRepository(entity).createQueryBuilder().delete().execute();
  }
}
