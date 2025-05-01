import {
  ExceptionFilter,
  Catch,
  NotFoundException,
  ArgumentsHost,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { join } from 'path';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const isRouteNotFound =
      exception.message === 'Cannot GET ' + request.url ||
      exception.message.startsWith('Cannot');

    if (isRouteNotFound) {
      return response
        .status(404)
        .sendFile(join(__dirname, '..', '..', 'src', 'public', '404.html'));
    }

    return response.status(404).json({
      statusCode: 404,
      message: exception.message || 'Resource not found',
      path: request.url,
    });
  }
}
