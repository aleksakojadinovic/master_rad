import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  ValidationPipe,
  UseGuards,
  Param,
  Body,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UsersService } from '../users/users.service';
import { NotificationQueryDTO } from './dto/notification-query.dto';
import { AuthGuard } from '@nestjs/passport';
import { ExtractUserInfo } from 'src/codebase/guards/user.guard';
import { GetUserInfo } from 'src/codebase/decorators/user.decorator';
import { User } from '../users/schema/user.schema';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Notification } from './schema/notification.schema';
import { NotificationDTO } from './dto/notification.dto';
import { NotificationsInterceptor } from './interceptors/notifications.interceptors';

@UseInterceptors(NotificationsInterceptor)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
    @InjectMapper() private mapper: Mapper,
  ) {}

  @Post()
  create() {
    return this.notificationsService.create();
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), ExtractUserInfo)
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    queryDTO: NotificationQueryDTO,
    @GetUserInfo() user: User,
  ) {
    const notifications = await this.notificationsService.findAll(
      queryDTO,
      user,
    );
    return this.mapper.mapArray(notifications, Notification, NotificationDTO);
  }

  @Get(':id')
  async findOne() {
    return null;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), ExtractUserInfo)
  async update(
    @Param('id') id: string,
    @Body('action') action: string,
    @GetUserInfo() user: User,
  ) {
    console.log(user);
    if (!action) {
      throw new BadRequestException('No action');
    }

    switch (action) {
      case 'mark_read':
        await this.notificationsService.markRead(id, user);
        return;
      default:
        throw new BadRequestException('Unknown action');
    }
  }

  @Delete(':id')
  remove() {
    return this.notificationsService.remove();
  }
}
