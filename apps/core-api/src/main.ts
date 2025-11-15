import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger} from 'pino-nestjs';
import {VERSION_NEUTRAL, VersioningType} from '@nestjs/common';
import {NestExpressApplication} from '@nestjs/platform-express';
import {ConfigService} from '@nestjs/config';
import {GlobalConfig} from './config/config.interface';
import {AppConfig, AppConfigName} from './config/app.config';
import helmet from 'helmet';
import setupSwagger from './tools/swagger/swagger.setup';
import cookieParser from 'cookie-parser';
import {AllExceptionsFilter} from './common/filters/all-exceptions.filter';
import {PosthogService} from './lib/posthog/posthog.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {bufferLogs: true});
  const configService = app.get(ConfigService<GlobalConfig>);
  const {webAppUrl} = configService.getOrThrow<AppConfig>(AppConfigName);

  const logger = app.get(Logger);
  const posthogService = app.get(PosthogService);

  app.useLogger(logger);
  app.enableShutdownHooks();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });
  app.useBodyParser('json', {limit: '10mb'});
  app.use(helmet());
  app.use(cookieParser());

  // Register global exception filter for centralized error handling and PostHog capture
  app.useGlobalFilters(new AllExceptionsFilter(logger, posthogService));

  setupSwagger(app);
  app.enableCors({
    origin: webAppUrl,
    credentials: true,
  });

  const {port} = configService.getOrThrow<AppConfig>(AppConfigName);
  await app.listen(port);
}

void bootstrap();
