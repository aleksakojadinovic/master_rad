import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/app/users/domain/users.service';
import { UserStatus } from 'src/app/users/domain/value-objects/user-status';

@Injectable()
export class ExtractUserInfo implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.user) {
      const user = await this.userService.findOne(request.user.id);

      if (user) {
        if (user.isBanned()) {
          throw new UnauthorizedException({ status: UserStatus.BANNED });
        }

        if (
          user.isRegistered() &&
          !request.route.path.includes('/api/users/:id')
        ) {
          throw new UnauthorizedException({ status: UserStatus.REGISTERED });
        }
      }

      request.userInfo = user;
    }
    return true;
  }
}

@Injectable()
export class ExtractUserInfoSilent implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.user && request.user.id) {
      const user = await this.userService.findOne(request.user.id);
      if (user) {
        request.userInfo = user;
        request.isBanned = user.isBanned();
        request.isRegistered = user.isRegistered();
      }
    }
    return true;
  }
}
