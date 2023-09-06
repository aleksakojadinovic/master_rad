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
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { User } from './schema/user.schema';
import { UserDTO } from './dto/user.dto';
import { ExtractUserInfo } from 'src/codebase/guards/user.guard';
import { GetUserInfo } from 'src/codebase/decorators/user.decorator';
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
  async create(@Body() dto: CreateUserDto) {
    const result = await this.usersService.create(dto);
    return this.mapper.map(result, User, UserDTO);
  }

  @UseGuards(AuthGuard('jwt'))
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
    if (!user.isAdministrator() && !user.isAgent()) {
      console.log(user.role);
      throw new UnauthorizedException();
    }
    const users = await this.usersService.findAll(queryDTO);
    return this.mapper.mapArray(users, User, UserDTO);
  }

  // TODO: protect
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return this.mapper.map(user, User, UserDTO);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), ExtractUserInfo)
  async update(
    @Param('string') id: string,
    @Body('action') action: string,
    @Body('token') token: string,
    @GetUserInfo() user: User,
  ) {
    if (!(user.hasRole('superadministrator') || user._id.toString() !== id)) {
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
