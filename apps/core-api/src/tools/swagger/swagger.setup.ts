import type {INestApplication} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {DocumentBuilder, OpenAPIObject, SwaggerModule} from '@nestjs/swagger';
import {AppConfig, AppConfigName} from 'src/config/app.config';
import {GlobalConfig} from '../../config/config.interface';

const SWAGGER_PATH = 'swagger';
const APP_NAME = 'NestWise Core API';
const APP_DESCRIPTION = 'NestWise Core API description';

function setupSwagger(app: INestApplication): OpenAPIObject {
  const configService = app.get(ConfigService<GlobalConfig>);

  const {url} = configService.getOrThrow(AppConfigName, {
    infer: true,
  });

  const appConfig = configService.getOrThrow<AppConfig>(AppConfigName);

  const config = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(APP_DESCRIPTION)
    .setVersion(appConfig.appVersion)
    .addBearerAuth()
    .addApiKey({type: 'apiKey', name: 'Api-Key', in: 'header'}, 'Api-Key')
    .addServer(url)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    customSiteTitle: APP_NAME,
    jsonDocumentUrl: 'swagger/json',
  });

  return document;
}

export default setupSwagger;
