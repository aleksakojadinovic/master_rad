import { validatePasswordHash } from 'src/utils';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/schemas/user.schema';
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

    const userPayload = new User(
      user.username,
      user.firstName,
      user.lastName,
      '',
      user.roles,
    );
    return userPayload;
  }

  async login(user: any) {
    const payload = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles.map(({ name }) => name),
    };
    const token = this.jwtService.sign(payload);
    // TODO: Add token to database
    return {
      access_token: token,
    };
  }
}
