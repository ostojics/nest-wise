import {registerAs} from '@nestjs/config';
import {PostgresConnectionOptions} from 'typeorm/driver/postgres/PostgresConnectionOptions';
import {User} from '../users/user.entity';
import {Household} from 'src/households/household.entity';
import {Account} from 'src/accounts/account.entity';
import {Category} from 'src/categories/categories.entity';
import {Transaction} from 'src/transactions/transaction.entity';
import {Savings} from 'src/savings/savings.entity';
import {CategoryBudget} from 'src/category-budgets/category-budgets.entity';

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
    database: process.env.DB_DATABASE ?? 'mayavault_dev',
    synchronize: isDevelopment,
    ssl: !isDevelopment,
    entities: [User, Household, Account, Category, Transaction, Savings, CategoryBudget],
    useUTC: true,
  };
}

export const databaseConfig = registerAs<DatabaseConfig>(DatabaseConfigName, () => {
  return getConfig();
});
