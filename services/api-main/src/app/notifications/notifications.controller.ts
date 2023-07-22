import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create() {
    return this.notificationsService.create();
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  findOne() {
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
