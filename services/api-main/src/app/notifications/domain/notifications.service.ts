import { Injectable } from '@nestjs/common';
import { NotificationQueryDTO } from '../api/dto/notification-query.dto';
import { BaseService } from 'src/codebase/BaseService';
import { FirebaseService } from '../../firebase/firebase.service';
import { NotificationNotFoundError } from './errors/NotificationNotFound';
import { NotificationsRepository } from '../infrastructure/notifications.repository';
import { User } from 'src/app/users/domain/entities/user.entity';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService extends BaseService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly notificationsRepository: NotificationsRepository,
  ) {
    super();
  }

  create() {
    return 'This action adds a new notification';
  }

  async findAll(queryDTO: NotificationQueryDTO, user: User) {
    const notifications = await this.notificationsRepository.findNotifications(
      { userId: user.id },
      { createdAt: -1 },
      queryDTO.page,
      queryDTO.perPage,
    );
    return notifications;
  }

  async countNewNotifications(user: User) {
    const notifications = await this.notificationsRepository.findNotifications({
      userId: user.id,
      unread: true,
    });
    return notifications.length;
  }

  findOne(id: string) {
    return this.notificationsRepository.findOne(id);
  }

  update() {
    return `This action updates A notification`;
  }

  remove() {
    return `This action removes a notification`;
  }

  async emitNotifications(...notifications: Notification[]) {
    try {
      const createdNotifications =
        await this.notificationsRepository.createMany(...notifications);

      await this.firebaseService.sendNotifications(...createdNotifications);
      return createdNotifications;
    } catch (e) {
      return null;
    }
  }

  async markRead(id: string, user: User) {
    const notification = await this.findOne(id);

    if (!notification) {
      throw new NotificationNotFoundError();
    }

    if (notification.user.id !== user.id) {
      throw new NotificationNotFoundError();
    }

    if (notification.readAt) {
      return Promise.resolve(notification);
    }

    notification.readAt = new Date();
    return this.notificationsRepository.update(notification);
  }
}
