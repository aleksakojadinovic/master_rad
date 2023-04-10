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
  async me(@Request() req) {
    const FakeCookie = req.cookies.FakeCookie;
    const [username, userId] = FakeCookie.split('@');
    return { id: userId, username };
  }
}
