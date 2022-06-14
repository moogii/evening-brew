import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(4000);
}
bootstrap();
