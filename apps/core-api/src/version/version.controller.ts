import {Controller, Get, Version} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {ConfigService} from '@nestjs/config';
import {GlobalConfig} from '../config/config.interface';
import {AppConfig, AppConfigName} from '../config/app.config';
import {VersionResponse} from './version.types';
import {readFileSync} from 'fs';
import {join} from 'path';

interface PackageJsonType {
  version?: string;
  [key: string]: unknown;
}

@ApiTags('Version')
@Controller('version')
export class VersionController {
  constructor(private readonly configService: ConfigService<GlobalConfig>) {}

  @Get()
  @Version('1')
  @ApiOperation({
    summary: 'Get application version information',
    description: 'Returns version metadata including app version, git commit, build date, and service versions',
  })
  @ApiResponse({
    status: 200,
    description: 'Version information retrieved successfully',
    type: VersionResponse,
  })
  getVersion(): VersionResponse {
    const appConfig = this.configService.getOrThrow<AppConfig>(AppConfigName);

    // Get contracts version from package.json
    const getContractsVersion = (): string => {
      try {
        const contractsPackagePath = join(process.cwd(), '../../packages/contracts/package.json');
        const packageJson = JSON.parse(readFileSync(contractsPackagePath, 'utf8')) as PackageJsonType;
        return packageJson.version ?? '0.0.1';
      } catch {
        return '0.0.1';
      }
    };

    // Get API version from package.json
    const getApiVersion = (): string => {
      try {
        const apiPackagePath = join(__dirname, '../../package.json');
        const packageJson = JSON.parse(readFileSync(apiPackagePath, 'utf8')) as PackageJsonType;
        return packageJson.version ?? '0.0.1';
      } catch {
        return '0.0.1';
      }
    };

    return {
      appVersion: appConfig.appVersion,
      apiVersion: getApiVersion(),
      contractsVersion: getContractsVersion(),
      gitCommit: appConfig.gitSha,
      buildDate: appConfig.buildDate,
    };
  }
}
