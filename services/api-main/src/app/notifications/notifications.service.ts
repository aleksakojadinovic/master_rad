import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  create() {
    return 'This action adds a new notification';
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne() {
    return `This action returns a notification`;
  }

  update() {
    return `This action updates A notification`;
  }

  remove() {
    return `This action removes a notification`;
  }
}
