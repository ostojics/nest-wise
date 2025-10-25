import {registerAs} from '@nestjs/config';
import {PostgresConnectionOptions} from 'typeorm/driver/postgres/PostgresConnectionOptions';
import {User} from '../users/user.entity';
import {Household} from 'src/households/household.entity';
import {Account} from 'src/accounts/account.entity';
import {Category} from 'src/categories/categories.entity';
import {Transaction} from 'src/transactions/transaction.entity';
import {Savings} from 'src/savings/savings.entity';
import {CategoryBudget} from 'src/category-budgets/category-budgets.entity';
import {PrivateTransaction} from 'src/private-transactions/private-transactions.entity';
import {License} from 'src/licenses/license.entity';
import {InitExtensionAndTypes1758655322744} from 'src/migrations/1758655322744-InitExtensionAndTypes';
import {InitLicensesAndHouseholds1758655441347} from 'src/migrations/1758655441347-InitLicensesAndHouseholds';
import {InitUsers1758655573420} from 'src/migrations/1758655573420-InitUsers';
import {InitAccounts1758655782220} from 'src/migrations/1758655782220-InitAccounts';
import {InitCategories1758655819716} from 'src/migrations/1758655819716-InitCategories';
import {InitSavingsAndBudgets1758655829601} from 'src/migrations/1758655829601-InitSavingsAndBudgets';
import {InitTransactions1758655840340} from 'src/migrations/1758655840340-InitTransactions';
import {InitPrivateTransactions1758655853118} from 'src/migrations/1758655853118-InitPrivateTransactions';
import {ConvertTransactionDateToTimestamptz1760208473000} from 'src/migrations/1760208473000-ConvertTransactionDateToTimestamptz';
import {ConvertPrivateTransactionDateToTimestamptz1760208473001} from 'src/migrations/1760208473001-ConvertPrivateTransactionDateToTimestamptz';
import {AddScheduledTransactionRules1760300000000} from 'src/migrations/1760300000000-AddScheduledTransactionRules';
import {AddScheduledTransactionExecutions1760300000001} from 'src/migrations/1760300000001-AddScheduledTransactionExecutions';
import {ScheduledTransactionRule} from 'src/scheduled-transactions/scheduled-transaction-rule.entity';

export const DatabaseConfigName = 'database';

export interface DatabaseConfig extends PostgresConnectionOptions {}

export function getConfig(): DatabaseConfig {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: +(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE ?? 'nestwise_dev',
    ssl: process.env.DB_USE_SSL === 'true',
    entities: [
      User,
      Household,
      Account,
      Category,
      Transaction,
      Savings,
      CategoryBudget,
      PrivateTransaction,
      License,
      ScheduledTransactionRule,
    ],
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
      ConvertTransactionDateToTimestamptz1760208473000,
      ConvertPrivateTransactionDateToTimestamptz1760208473001,
      AddScheduledTransactionRules1760300000000,
      AddScheduledTransactionExecutions1760300000001,
    ],
    migrationsRun: true,
    extra: {
      max: process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX, 10) : 15,
      min: process.env.DB_POOL_MIN ? parseInt(process.env.DB_POOL_MIN, 10) : 2,
      idleTimeoutMillis: 20000,
      connectionTimeoutMillis: 10000,
    },
    logging: ['warn', 'error'],
  };
}

export const databaseConfig = registerAs<DatabaseConfig>(DatabaseConfigName, () => {
  return getConfig();
});
