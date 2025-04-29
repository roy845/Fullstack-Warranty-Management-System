import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Request, Response } from 'express';
import { AuthEnum } from 'src/auth/constants/auth-constants';

@Catch(MongoError)
export class MongoDBExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception.code === AuthEnum.DUPLICATE_USER_CODE) {
      const errorMessage = exception.message || '';
      const match = errorMessage.match(/index: (\w+)_\d* dup key/);
      const field = match ? match[1] : 'Field';

      return response.status(400).json({
        statusCode: 400,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      });
    }

    return response.status(400).json({
      statusCode: 400,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message || 'Database error',
    });
  }
}
