import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
  Query,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HasRoles } from 'src/app/auth/has-roles.decorator';
import { RolesGuard } from 'src/app/auth/roles.guard';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { User } from './schema/user.schema';
import { UserDTO } from './dto/user.dto';
import { ExtractUserInfo } from 'src/codebase/guards/user.guard';
import { GetUserInfo } from 'src/codebase/decorators/user.decorator';
import * as _ from 'lodash';
import { UsersQueryDTO } from './dto/users-query.dto';
import { UsersInterceptor } from './interceptors/users.interceptor';
@UseInterceptors(UsersInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @HasRoles('agent')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('profile')
  getProfile() {
    return 'Hello!';
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), ExtractUserInfo)
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    queryDTO: UsersQueryDTO,
    @GetUserInfo() user: User,
  ) {
    // TODO: Rethink this
    if (
      _.intersection(
        user.roles.map(({ name }) => name),
        ['agent', 'administrator', 'superadministrator'],
      ).length <= 0
    ) {
      throw new UnauthorizedException();
    }
    const users = await this.usersService.findAll(queryDTO, user);
    return this.mapper.mapArray(users, User, UserDTO);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return this.mapper.map(user, User, UserDTO);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.usersService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
