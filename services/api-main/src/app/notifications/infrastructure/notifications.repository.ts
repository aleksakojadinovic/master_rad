import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import {
  NotificationDb,
  NotificationDocument,
} from './schema/notification.schema';

export type NotificationFilterType = {
  userId?: string | null;
  unread?: boolean | null;
  createdFrom?: Date | null;
  createdTo?: Date | null;
  type?: string | null;
};

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectModel(NotificationDb.name)
    private notificationModel: Model<NotificationDb>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private static POPULATE = [
    { path: 'user', model: 'User' },
    { path: 'payload.ticket', model: 'Ticket' },
    { path: 'payload.user', model: 'User' },
  ];

  findOne(id: string) {
    return this.notificationModel
      .findOne({ _id: id })
      .populate(NotificationsRepository.POPULATE);
  }

  findNotifications(
    filters: NotificationFilterType,
    sort: any = null,
    page: number | null = null,
    perPage: number | null = null,
  ) {
    const queryObject: any = {};
    if (filters.userId) {
      queryObject.user = filters.userId;
    }
    if (filters.type) {
      queryObject.type = filters.type;
    }

    if (filters.unread != null) {
      if (!filters.unread) {
        queryObject.readAt = { $ne: null };
      } else {
        queryObject.readAt = null;
      }
    }

    const query = this.notificationModel
      .find(queryObject)
      .populate(NotificationsRepository.POPULATE);

    if (sort) {
      query.sort(sort);
    }

    if (page && perPage) {
      query.skip((page - 1) * perPage).limit(perPage);
    }

    return query.exec();
  }

  async createMany(...notifications: NotificationDb[]) {
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
    return this.notificationModel
      .findById(id)
      .populate(NotificationsRepository.POPULATE);
  }
}
