import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UsersService } from 'src/app/users/domain/users.service';

@Injectable()
export class ExtractUserInfo implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.user) {
      const user = await this.userService.findOne(request.user._id);
      request.userInfo = user;
    }
    return true;
  }
}
