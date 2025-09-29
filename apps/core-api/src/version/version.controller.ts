import {Controller, Get, Version} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {ConfigService} from '@nestjs/config';
import {GlobalConfig} from '../config/config.interface';
import {AppConfig, AppConfigName} from '../config/app.config';
import {VersionResponse} from './version.types';

@ApiTags('Version')
@Controller('version')
export class VersionController {
  constructor(private readonly configService: ConfigService<GlobalConfig>) {}

  @Get()
  @Version('1')
  @ApiOperation({
    summary: 'Get application version information',
    description: 'Returns version metadata including app version, git commit, and build date',
  })
  @ApiResponse({
    status: 200,
    description: 'Version information retrieved successfully',
    type: VersionResponse,
  })
  getVersion(): VersionResponse {
    const appConfig = this.configService.getOrThrow<AppConfig>(AppConfigName);

    return {
      appVersion: appConfig.appVersion,
      gitCommit: appConfig.gitSha,
      buildDate: appConfig.buildDate,
    };
  }
}
