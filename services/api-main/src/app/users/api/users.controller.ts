import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  UnauthorizedException,
  Query,
  ValidationPipe,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../domain/users.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserDTO } from './dto/user.dto';
import { ExtractUserInfo } from 'src/codebase/guards/user.guard';
import { GetUserInfo } from 'src/codebase/decorators/user.decorator';
import { UsersQueryDTO } from './dto/users-query.dto';
import { UsersInterceptor } from '../infrastructure/interceptors/users.interceptor';
import { User } from '../domain/entities/user.entity';

@UseInterceptors(UsersInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), ExtractUserInfo)
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    dto: UsersQueryDTO,
    @GetUserInfo() user: User,
  ) {
    if (!user.isAdministrator() && !user.isAgent()) {
      throw new UnauthorizedException();
    }
    const users = await this.usersService.findAll(dto);
    return this.mapper.mapArray(users, User, UserDTO);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return this.mapper.map(user, User, UserDTO);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), ExtractUserInfo)
  async update(
    @Param('id') id: string,
    @Body('action') action: string,
    @Body('token') token: string,
    @GetUserInfo() user: User,
  ) {
    if (!user.isAdministrator() && user.id !== id) {
      throw new UnauthorizedException();
    }

    if (!action) {
      throw new BadRequestException('No action');
    }

    switch (action) {
      case 'register_firebase_token':
        if (!token) {
          throw new BadRequestException('No token');
        }
        await this.usersService.registerFirebaseToken(user, token);
        return;
      default:
        throw new BadRequestException('Unknown action');
    }
  }
}
