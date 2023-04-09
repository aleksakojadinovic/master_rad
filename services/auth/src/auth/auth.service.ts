import { getPasswordHash, validatePasswordHash } from 'src/utils';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return null;
    }
    if (!(await validatePasswordHash(password, user.passwordHash))) {
      return null;
    }

    const userPayload = new User(
      user.username,
      user.firstName,
      user.lastName,
      '',
      user.roles,
    );
    return userPayload;
  }
}
