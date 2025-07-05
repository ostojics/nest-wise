import {registerAs} from '@nestjs/config';

export const DatabaseConfigName = 'database';

export interface DatabaseConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  database: string;
  synchronize: boolean;
  ssl: boolean | {rejectUnauthorized: boolean};
}

export function getConfig(): DatabaseConfig {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    type: process.env.DB_TYPE ?? 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: +(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? 'user',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE ?? 'database',
    synchronize: isDevelopment,
    ssl: !isDevelopment ? {rejectUnauthorized: false} : false,
  };
}

export const databaseConfig = registerAs<DatabaseConfig>(DatabaseConfigName, () => {
  return getConfig();
});
