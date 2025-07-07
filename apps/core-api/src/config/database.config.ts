import {registerAs} from '@nestjs/config';
import {PostgresConnectionOptions} from 'typeorm/driver/postgres/PostgresConnectionOptions';

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
    ssl: isDevelopment,
    entities: [],
  };
}

export const databaseConfig = registerAs<DatabaseConfig>(DatabaseConfigName, () => {
  return getConfig();
});
