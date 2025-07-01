import {registerAs} from '@nestjs/config';

export type AppConfig = {
  url: string;
  port: number;
};

export const AppConfigName = 'app';

export function getConfig(): AppConfig {
  const port = parseInt(process.env.APP_PORT ?? '8080', 10);

  return {
    url: process.env.APP_URL || `http://localhost:${port}`,
    port,
  };
}

export const appConfig = registerAs<AppConfig>(AppConfigName, () => {
  return getConfig();
});
