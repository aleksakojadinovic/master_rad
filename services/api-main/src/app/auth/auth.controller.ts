import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Get,
  Header,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ExtractUserInfo } from 'src/codebase/guards/user.guard';
import { GetUserInfo } from 'src/codebase/decorators/user.decorator';
import { UserDTO } from '../users/api/dto/user.dto';
import { User } from '../users/domain/entities/user.entity';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('me')
  @Header('content-type', 'application/json')
  @UseGuards(AuthGuard('jwt'), ExtractUserInfo)
  async me(@GetUserInfo() user: User) {
    return this.mapper.map(user, User, UserDTO);
  }
}
