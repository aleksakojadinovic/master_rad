import { validatePasswordHash } from 'src/utils';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/app/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return null;
    }
    if (!(await validatePasswordHash(password, user.passwordHash))) {
      return null;
    }

    const userPayload = {
      id: user._id.toString(),
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      passwordHash: '',
      roles: user.roles,
    };

    return userPayload;
  }

  async login(user: any) {
    const payload = {
      _id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
    };
    const token = this.jwtService.sign(payload);
    // TODO: Add token to database
    return {
      access_token: token,
    };
  }
}
