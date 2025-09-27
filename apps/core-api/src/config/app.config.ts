import {registerAs} from '@nestjs/config';
import {readFileSync} from 'fs';
import {join} from 'path';

export interface AppConfig {
  url: string;
  port: number;
  jwtSecret: string;
  environment: string;
  openaiApiKey: string;
  resendApiKey: string;
  webAppUrl: string;
  cookieDomain: string | null;
  appVersion: string;
  gitSha: string;
  buildDate: string;
}

interface PackageJsonType {
  version?: string;
  [key: string]: unknown;
}

export const AppConfigName = 'app';

export function getConfig(): AppConfig {
  const port = parseInt(process.env.PORT ?? '8080', 10);

  // Helper to get app version from various sources
  const getAppVersion = (): string => {
    // First try environment variable
    if (process.env.APP_VERSION) {
      return process.env.APP_VERSION;
    }

    // Try to read from root VERSION file
    try {
      const versionPath = join(process.cwd(), '../../VERSION');
      const version = readFileSync(versionPath, 'utf8').trim();
      if (version) {
        return version;
      }
    } catch {
      // Fall back to package.json if VERSION file doesn't exist
    }

    // Fallback to package.json version
    try {
      const packagePath = join(__dirname, '../../package.json');
      const packageJson = JSON.parse(readFileSync(packagePath, 'utf8')) as PackageJsonType;
      return packageJson.version ?? '0.0.1';
    } catch {
      return '0.0.1';
    }
  };

  // Helper to get git SHA
  const getGitSha = (): string => {
    if (process.env.GIT_SHA) {
      return process.env.GIT_SHA;
    }

    // In development, try to get git SHA
    if (process.env.NODE_ENV === 'development') {
      try {
        const {execSync} = require('child_process');
        return execSync('git rev-parse --short HEAD', {encoding: 'utf8'}).trim();
      } catch {
        return 'unknown';
      }
    }

    return 'unknown';
  };

  return {
    url: process.env.APP_URL ?? `http://localhost:${port}`,
    port,
    jwtSecret: process.env.JWT_SECRET ?? 'secret',
    environment: process.env.NODE_ENV ?? 'development',
    openaiApiKey: process.env.OPENAI_API_KEY ?? '',
    resendApiKey: process.env.RESEND_API_KEY ?? '',
    webAppUrl: process.env.WEB_APP_URL ?? '',
    cookieDomain: process.env.COOKIE_DOMAIN ?? null,
    appVersion: getAppVersion(),
    gitSha: getGitSha(),
    buildDate: process.env.BUILD_DATE ?? new Date().toISOString(),
  };
}

export const appConfig = registerAs<AppConfig>(AppConfigName, () => {
  return getConfig();
});
