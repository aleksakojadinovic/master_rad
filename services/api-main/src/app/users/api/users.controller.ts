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
import { createPaginatedResponse } from 'src/codebase/utils';
import { ROLE_VALUES } from '../domain/value-objects/role';

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
    const results = await this.usersService.findAll(dto);
    const users = this.mapper.mapArray(results.entities, User, UserDTO);
    return createPaginatedResponse(
      users,
      results.page,
      results.perPage,
      results.totalEntities,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return this.mapper.map(user, User, UserDTO);
  }

  // TODO: Rework this
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), ExtractUserInfo)
  async update(
    @Param('id') id: string,
    @Body('action') action: string,
    @Body('token') token: string,
    @Body('role') role: string,
    @GetUserInfo() user: User,
  ) {
    if (!action) {
      throw new BadRequestException('No action');
    }

    switch (action) {
      case 'register_firebase_token':
        if (!token) {
          throw new BadRequestException('No token');
        }
        await this.usersService.registerFirebaseToken(id, user, token);
        return;
      case 'change_role':
        if (!role || !ROLE_VALUES[role]) {
          throw new BadRequestException('Bad role');
        }
        await this.usersService.updateRole(id, user, ROLE_VALUES[role]);
        return;
      default:
        throw new BadRequestException('Unknown action');
    }
  }
}
