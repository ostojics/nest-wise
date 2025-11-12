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
}

export const AppConfigName = 'app';

export function getConfig(): AppConfig {
  const port = parseInt(process.env.PORT ?? '8080', 10);
  const environment = process.env.NODE_ENV || 'development';

  // Validate OPENAI_API_KEY at startup (not in test environments)
  const openaiApiKey = process.env.OPENAI_API_KEY || '';
  if (environment !== 'test' && !openaiApiKey) {
    throw new Error(
      'OPENAI_API_KEY is required when AI features are enabled. Please set the OPENAI_API_KEY environment variable.',
    );
  }

  return {
    url: process.env.APP_URL || `http://localhost:${port}`,
    port,
    jwtSecret: process.env.JWT_SECRET || 'secret',
    environment,
    openaiApiKey, // Never log this value
    resendApiKey: process.env.RESEND_API_KEY || '',
    webAppUrl: process.env.WEB_APP_URL || '',
    cookieDomain: process.env.COOKIE_DOMAIN || null,
    logLevel: process.env.LOG_LEVEL || 'info',
  };
}

export const appConfig = registerAs<AppConfig>(AppConfigName, () => {
  return getConfig();
});
