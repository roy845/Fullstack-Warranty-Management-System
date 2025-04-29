import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { allowedOrigins } from './config/allowedOrigins';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { config } from './config/swagger-ui.config';
import { ConfigService } from '@nestjs/config';
import { CredentialsMiddleware } from './middlewares/CredentialsMiddleware';
import { MongoDBExceptionFilter } from './filters/mongodb-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(new CredentialsMiddleware().use);
  app.useGlobalFilters(new MongoDBExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
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

  app.setGlobalPrefix('/api');
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger/docs', app, document);
  const configService: ConfigService<unknown, boolean> = app.get(ConfigService);
  const port: number = configService.get<number>('PORT') as number;

  await app.listen(port || 5001, '0.0.0.0');
}
bootstrap();
