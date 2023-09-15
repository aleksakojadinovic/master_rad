import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Get,
  Header,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ExtractUserInfoSilent } from 'src/codebase/guards/user.guard';
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
  @UseGuards(AuthGuard('jwt'), ExtractUserInfoSilent)
  async me(@GetUserInfo() user: User, @Request() req) {
    if (req.isBanned) {
      throw new UnauthorizedException();
    }

    return this.mapper.map(user, User, UserDTO);
  }
}
