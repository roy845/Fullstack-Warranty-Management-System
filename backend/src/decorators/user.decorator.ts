import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserJWTResponse } from 'src/auth/types/jwt.types';

export const User = createParamDecorator(
  (data: keyof UserJWTResponse | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      throw new Error('No user found in request');
    }

    return data ? request.user[data] : request.user;
  },
);
