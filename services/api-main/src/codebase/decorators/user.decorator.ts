import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/app/users/infrastructure/schema/user.schema';

export const GetUserInfo = createParamDecorator<User | null>(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    const userInfo = request.userInfo;
    return userInfo ?? null;
  },
);
