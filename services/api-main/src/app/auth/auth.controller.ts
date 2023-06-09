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
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('me')
  @Header('content-type', 'application/json')
  @UseGuards(AuthGuard('jwt'))
  async me(@Request() req) {
    return req.user;
  }
}
