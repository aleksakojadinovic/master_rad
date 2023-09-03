import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schema/notification.schema';
import { User } from '../users/schema/user.schema';
import { NotificationQueryDTO } from './dto/notification-query.dto';
import { BaseService } from 'src/codebase/BaseService';
import { FirebaseService } from '../firebase/firebase.service';
import { NotificationNotFoundError } from './errors/NotificationNotFound';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService extends BaseService {
  constructor(
    @InjectModel(Notification.name)
    private readonly firebaseService: FirebaseService,
    private readonly notificationsRepository: NotificationsRepository,
  ) {
    super();
  }

  create() {
    return 'This action adds a new notification';
  }

  async findAll(queryDTO: NotificationQueryDTO, user: User) {
    const notifications =
      await this.notificationsRepository.findNotificationsForUserId(
        user._id.toString(),
        queryDTO.page,
        queryDTO.perPage,
      );
    return notifications;
  }

  findOne(id: string) {
    return this.notificationsRepository.findNotificationById(id);
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

    if (notification.user._id !== user._id) {
      throw new NotificationNotFoundError();
    }

    if (notification.readAt) {
      return Promise.resolve(notification);
    }

    notification.readAt = new Date();
    return notification.save();
  }
}
