import {PostgreSqlContainer, StartedPostgreSqlContainer} from '@testcontainers/postgresql';
import {RedisContainer, StartedRedisContainer} from '@testcontainers/redis';
import {DataSource} from 'typeorm';
import * as path from 'path';

// Import entities and migrations using relative paths
import {User} from '../../../src/users/user.entity';
import {Household} from '../../../src/households/household.entity';
import {Account} from '../../../src/accounts/account.entity';
import {Category} from '../../../src/categories/categories.entity';
import {Transaction} from '../../../src/transactions/transaction.entity';
import {Savings} from '../../../src/savings/savings.entity';
import {CategoryBudget} from '../../../src/category-budgets/category-budgets.entity';
import {PrivateTransaction} from '../../../src/private-transactions/private-transactions.entity';
import {License} from '../../../src/licenses/license.entity';

// Import migrations
import {InitExtensionAndTypes1758655322744} from '../../../src/migrations/1758655322744-InitExtensionAndTypes';
import {InitLicensesAndHouseholds1758655441347} from '../../../src/migrations/1758655441347-InitLicensesAndHouseholds';
import {InitUsers1758655573420} from '../../../src/migrations/1758655573420-InitUsers';
import {InitAccounts1758655782220} from '../../../src/migrations/1758655782220-InitAccounts';
import {InitCategories1758655819716} from '../../../src/migrations/1758655819716-InitCategories';
import {InitSavingsAndBudgets1758655829601} from '../../../src/migrations/1758655829601-InitSavingsAndBudgets';
import {InitTransactions1758655840340} from '../../../src/migrations/1758655840340-InitTransactions';
import {InitPrivateTransactions1758655853118} from '../../../src/migrations/1758655853118-InitPrivateTransactions';

declare global {
  // eslint-disable-next-line no-var
  var __POSTGRES_CONTAINER__: StartedPostgreSqlContainer;
  // eslint-disable-next-line no-var
  var __REDIS_CONTAINER__: StartedRedisContainer;
}

export default async function globalSetup(): Promise<void> {
  console.log('Starting integration test containers...');

  try {
    // Start PostgreSQL container
    console.log('Starting PostgreSQL container...');
    const postgresContainer = await new PostgreSqlContainer('postgres:15')
      .withDatabase('nestwise_test')
      .withUsername('test_user')
      .withPassword('test_password')
      .withExposedPorts(5432)
      .start();

    global.__POSTGRES_CONTAINER__ = postgresContainer;

    // Start Redis container
    console.log('Starting Redis container...');
    const redisContainer = await new RedisContainer('redis:7-alpine').withExposedPorts(6379).start();

    global.__REDIS_CONTAINER__ = redisContainer;

    // Set environment variables for the application
    process.env.NODE_ENV = 'test';
    process.env.DB_HOST = postgresContainer.getHost();
    process.env.DB_PORT = postgresContainer.getMappedPort(5432).toString();
    process.env.DB_USERNAME = 'test_user';
    process.env.DB_PASSWORD = 'test_password';
    process.env.DB_DATABASE = 'nestwise_test';
    process.env.DB_USE_SSL = 'false';

    process.env.REDIS_HOST = redisContainer.getHost();
    process.env.REDIS_PORT = redisContainer.getMappedPort(6379).toString();
    process.env.REDIS_PASSWORD = '';

    // Other required environment variables
    process.env.RESEND_API_KEY = 'dummy-key-for-test';
    process.env.JWT_SECRET = 'test-secret';
    process.env.APP_URL = 'http://localhost:8080';
    process.env.WEB_APP_URL = 'http://localhost:5173';

    console.log('Running database migrations...');

    // Create DataSource configuration similar to database.config.ts but with explicit entities
    const dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      ssl: process.env.DB_USE_SSL === 'true',
      entities: [User, Household, Account, Category, Transaction, Savings, CategoryBudget, PrivateTransaction, License],
      useUTC: true,
      migrations: [
        InitExtensionAndTypes1758655322744,
        InitLicensesAndHouseholds1758655441347,
        InitUsers1758655573420,
        InitAccounts1758655782220,
        InitCategories1758655819716,
        InitSavingsAndBudgets1758655829601,
        InitTransactions1758655840340,
        InitPrivateTransactions1758655853118,
      ],
      migrationsRun: false, // We'll run them manually
      synchronize: false,
    });

    await dataSource.initialize();
    await dataSource.runMigrations();
    await dataSource.destroy();

    console.log('✅ Integration test containers started successfully');
    console.log(`PostgreSQL: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`Redis: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
  } catch (error) {
    console.error('❌ Failed to start integration test containers:', error);
    throw error;
  }
}
