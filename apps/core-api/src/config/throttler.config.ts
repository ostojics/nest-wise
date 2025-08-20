import {ConfigService, registerAs} from '@nestjs/config';
import {GlobalConfig} from './config.interface';

export interface ThrottlerConfig {
  throttlerEnabled: boolean;
  ttl: number;
  limit: number;
}

export const ThrottlerConfigName = 'throttler';

export function getConfig(): ThrottlerConfig {
  const throttlerEnabled = process.env.THROTTLER_ENABLED ? process.env.THROTTLER_ENABLED === 'true' : false;

  return {
    throttlerEnabled,
    ttl: +process.env.THROTTLER_TTL! || 60000,
    limit: +process.env.THROTTLER_LIMIT! || 100,
  };
}

export function throttlerFactory() {
  return (configService: ConfigService<GlobalConfig>) => {
    const {throttlerEnabled, ttl, limit} = configService.get<ThrottlerConfig>(ThrottlerConfigName, {
      infer: true,
    }) as ThrottlerConfig;

    if (!throttlerEnabled) return {throttlers: []};

    return {
      throttlers: [
        {
          ttl,
          limit,
        },
      ],
    };
  };
}

export const throttlerConfig = registerAs<ThrottlerConfig>(ThrottlerConfigName, () => {
  return getConfig();
});
