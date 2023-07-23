import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UsersService } from '../users/users.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  create() {
    return this.notificationsService.create();
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  async findOne() {
    // notification.users =
    // const commentAddedTest = new this.commentAddedNotificationModel();
    // commentAddedTest.createdAt;
    return this.notificationsService.findOne();
  }

  @Patch(':id')
  update() {
    return this.notificationsService.update();
  }

  @Delete(':id')
  remove() {
    return this.notificationsService.remove();
  }
}
