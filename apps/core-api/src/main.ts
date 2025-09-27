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
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import {resources, defaultNamespaces, supportedLanguages} from '@nest-wise/locales';
import path from 'path';

async function bootstrap() {
  // Initialize i18next before creating the app
  await i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
      resources,
      fallbackLng: 'en',
      defaultNS: defaultNamespaces[0],
      ns: defaultNamespaces,
      supportedLngs: supportedLanguages,
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['header'],
        lookupHeader: 'accept-language',
        caches: false,
      },
    });

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {bufferLogs: true});
  const configService = app.get(ConfigService<GlobalConfig>);
  const {webAppUrl} = configService.getOrThrow<AppConfig>(AppConfigName);

  app.useLogger(app.get(Logger));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });
  app.useBodyParser('json', {limit: '10mb'});
  app.use(helmet());
  app.use(cookieParser());

  // Add i18next middleware
  app.use(middleware.handle(i18next));

  setupSwagger(app);
  app.enableCors({
    origin: webAppUrl,
    credentials: true,
  });

  const {port} = configService.getOrThrow<AppConfig>(AppConfigName);
  await app.listen(port);
}

void bootstrap();
