import {AppConfig} from './app.config';
import {DatabaseConfig} from './database.config';
import {ThrottlerConfig} from './throttler.config';

export interface GlobalConfig {
  app: AppConfig;
  throttler: ThrottlerConfig;
  database: DatabaseConfig;
}
