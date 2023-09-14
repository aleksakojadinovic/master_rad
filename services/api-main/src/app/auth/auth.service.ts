import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/app/users/domain/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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
    if (!(await bcrypt.compare(password, user.passwordHash))) {
      return null;
    }

    const userPayload = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      passwordHash: '',
      role: user.role,
    };

    return userPayload;
  }

  async login(user: any) {
    const payload = {
      _id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }
}
