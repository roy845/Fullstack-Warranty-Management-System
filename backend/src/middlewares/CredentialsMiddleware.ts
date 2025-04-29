import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { allowedOrigins } from 'src/config/allowedOrigins';

@Injectable()
export class CredentialsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin as string)) {
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    next();
  }
}
