import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger} from 'pino-nestjs';
import {VERSION_NEUTRAL, VersioningType} from '@nestjs/common';
import {NestExpressApplication} from '@nestjs/platform-express';
import {ConfigService} from '@nestjs/config';
import {GlobalConfig} from './config/config.type';
import {AppConfig, AppConfigName} from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {bufferLogs: true});
  const configService = app.get(ConfigService<GlobalConfig>);

  app.useLogger(app.get(Logger));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });
  app.useBodyParser('json', {limit: '10mb'});

  const {port} = configService.getOrThrow<AppConfig>(AppConfigName);
  await app.listen(port);
}

void bootstrap();
