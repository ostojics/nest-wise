import {registerAs} from '@nestjs/config';

export interface AppConfig {
  url: string;
  port: number;
  jwtSecret: string;
  environment: string;
  openaiApiKey: string;
}

export const AppConfigName = 'app';

export function getConfig(): AppConfig {
  const port = parseInt(process.env.APP_PORT ?? '8080', 10);

  return {
    url: process.env.APP_URL || `http://localhost:${port}`,
    port,
    jwtSecret: process.env.JWT_SECRET || 'secret',
    environment: process.env.NODE_ENV || 'development',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
  };
}

export const appConfig = registerAs<AppConfig>(AppConfigName, () => {
  return getConfig();
});
