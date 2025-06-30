import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger} from 'pino-nestjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {bufferLogs: true});
  await app.listen(process.env.PORT ?? 8080);
  app.useLogger(app.get(Logger));
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
