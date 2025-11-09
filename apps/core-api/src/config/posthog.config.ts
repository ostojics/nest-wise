import {registerAs} from '@nestjs/config';

export interface PosthogConfig {
  apiKey: string;
  host: string;
  enabled: boolean;
}

export const PosthogConfigName = 'posthog';

export function getConfig(): PosthogConfig {
  return {
    apiKey: process.env.POSTHOG_API_KEY || '',
    host: process.env.POSTHOG_HOST || 'https://app.posthog.com',
    enabled: process.env.POSTHOG_ENABLED === 'true',
  };
}

export const posthogConfig = registerAs<PosthogConfig>(PosthogConfigName, () => {
  return getConfig();
});
