
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from '../core/token.core';

// Định nghĩa để data chỉ được phép là các key của TokenPayload (VD: 'userId', 'email')
export const CurrentUser = createParamDecorator(
  (data: keyof TokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as TokenPayload;

    if (!user) {
      return null;
    }

    if (data) {
      return user[data];
    }

    return user;
  },
);
