import { getPasswordHash } from 'src/utils';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUserName(username);
    if (!user) {
      return null;
    }
    const hashedPassword = getPasswordHash(password);
    if (hashedPassword !== user.passwordHash) {
      return null;
    }
    const userPayload = new User(
      user.username,
      user.firstName,
      user.lastName,
      '',
    );
    return userPayload;
  }
}
