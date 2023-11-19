import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../domain/auth.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ExtractUserInfoSilent } from 'src/codebase/guards/user.guard';
import { GetUserInfo } from 'src/codebase/decorators/user.decorator';
import { UserDTO } from '../../users/api/dto/user.dto';
import { User } from '../../users/domain/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@Controller('auth')
@UseInterceptors(AuthInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Post('login')
  async login(@Res() res: Response, @Body(new ValidationPipe()) dto: LoginDto) {
    const token = await this.authService.login(dto);

    res.cookie('accessToken', token, { httpOnly: false, sameSite: 'strict' });
    res.status(200).json({});

    return {};
  }

  @Get('me')
  @Header('content-type', 'application/json')
  @UseGuards(AuthGuard('jwt'), ExtractUserInfoSilent)
  async me(@GetUserInfo() user: User) {
    if (user.isBanned()) {
      throw new UnauthorizedException();
    }

    return this.mapper.map(user, User, UserDTO);
  }
}
