import {registerAs} from '@nestjs/config';

export interface AppConfig {
  url: string;
  port: number;
  jwtSecret: string;
  environment: string;
  openaiApiKey: string;
  resendApiKey: string;
  webAppUrl: string;
  cookieDomain: string | null;
  logLevel: string;
  timezone: string;
}

export const AppConfigName = 'app';

export function getConfig(): AppConfig {
  const port = parseInt(process.env.PORT ?? '8080', 10);

  return {
    url: process.env.APP_URL || `http://localhost:${port}`,
    port,
    jwtSecret: process.env.JWT_SECRET || 'secret',
    environment: process.env.NODE_ENV || 'development',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    resendApiKey: process.env.RESEND_API_KEY || '',
    webAppUrl: process.env.WEB_APP_URL || '',
    cookieDomain: process.env.COOKIE_DOMAIN || null,
    logLevel: process.env.LOG_LEVEL || 'info',
    timezone: process.env.APP_TIMEZONE || 'Europe/Belgrade',
  };
}

export const appConfig = registerAs<AppConfig>(AppConfigName, () => {
  return getConfig();
});
