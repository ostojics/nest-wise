import {AppConfig} from './app.config';
import {DatabaseConfig} from './database.config';
import {QueuesConfig} from './queues.config';
import {ThrottlerConfig} from './throttler.config';
import {PosthogConfig} from './posthog.config';

export interface GlobalConfig {
  app: AppConfig;
  throttler: ThrottlerConfig;
  database: DatabaseConfig;
  queues: QueuesConfig;
  posthog: PosthogConfig;
}
