import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import {
  Notification,
  NotificationDocument,
} from './schema/notification.schema';

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private static POPULATE = [
    { path: 'users', model: 'User' },
    { path: 'payload.ticket', model: 'Ticket' },
    { path: 'payload.user', model: 'User' },
  ];

  findOne(id: string) {
    return this.notificationModel
      .findOne({ _id: id })
      .populate(NotificationsRepository.POPULATE);
  }

  findNotificationsForUserId(userId: string, page = 1, perPage = 10) {
    const query = this.notificationModel
      .find({ users: { $in: userId } })
      .populate(NotificationsRepository.POPULATE)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return query.exec();
  }

  async createMany(...notifications: Notification[]) {
    const models = notifications.map((n) => {
      const obj = Object.assign({}, n);
      const payload = Object.assign({}, obj.payload);
      return new this.notificationModel({ ...obj, payload });
    });
    const savedNotifications = await Promise.all(
      models.map((model) =>
        model
          .save()
          .then((model) => model.populate(NotificationsRepository.POPULATE)),
      ),
    );
    return savedNotifications;
  }

  findNotificationById(id: string): Promise<NotificationDocument> {
    return this.notificationModel.findById(id);
  }
}
