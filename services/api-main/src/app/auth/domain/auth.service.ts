import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/app/users/domain/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsernameOrPasswordNotValidError } from './errors/UsernameOrPasswordNotValid';
import { LoginDto } from '../api/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<string> {
    const user = await this.usersService.findByUsername(dto.username, true);

    if (!user) {
      throw new UsernameOrPasswordNotValidError();
    }

    if (!(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UsernameOrPasswordNotValidError();
    }

    const userPayload = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      passwordHash: '',
      role: user.role,
    };

    const token = this.jwtService.sign(userPayload);

    return token;
  }
}
