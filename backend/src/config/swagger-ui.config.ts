import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

export const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
  .setTitle('Tadiran Assignment API')
  .setDescription('This is a Tadiran Assignment API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
