import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { allowedOrigins } from './config/allowedOrigins';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { config } from './config/swagger-ui.config';
import { ConfigService } from '@nestjs/config';
import { CredentialsMiddleware } from './middlewares/CredentialsMiddleware';
import { MongoDBExceptionFilter } from './filters/mongodb-exception.filter';
import * as cookieParser from 'cookie-parser';
import { NotFoundExceptionFilter } from './filters/not-found-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(new CredentialsMiddleware().use);
  app.useGlobalFilters(new MongoDBExceptionFilter());
  app.useGlobalFilters(new NotFoundExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,

    allowedHeaders: [
      'Authorization',
      'Content-Type',
      'Content-Range',
      'Range',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Range'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger/docs', app, document);
  const configService: ConfigService<unknown, boolean> = app.get(ConfigService);
  const port: number = configService.get<number>('PORT') as number;

  await app.listen(port || 5001, '0.0.0.0');
}
bootstrap();
