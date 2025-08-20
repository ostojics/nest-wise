import {registerAs} from '@nestjs/config';

export interface QueuesConfig {
  redisHost: string;
  redisPort: number;
}

export const QueuesConfigName = 'queues';

export function getConfig(): QueuesConfig {
  return {
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  };
}

export const queuesConfig = registerAs<QueuesConfig>(QueuesConfigName, () => {
  return getConfig();
});
