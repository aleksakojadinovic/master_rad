import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { NotificationDb } from './schema/notification.schema';
import { Notification } from '../domain/entities/notification.entity';

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

  async findOne(id: string): Promise<Notification | null> {
    const result = await this.notificationModel
      .findById(id)
      .populate(NotificationsRepository.POPULATE);

    return this.mapper.map(result, NotificationDb, Notification);
  }

  async findNotifications(
    filters: NotificationFilterType,
    sort: any = null,
    page: number | null = null,
    perPage: number | null = null,
  ): Promise<Notification[]> {
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

    const result = await query.exec();
    return this.mapper.mapArray(result, NotificationDb, Notification);
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

    return this.mapper.mapArray(
      savedNotifications,
      NotificationDb,
      Notification,
    );
  }

  async update(notification: Notification) {
    const updateObject: any = {};
    updateObject.user = notification.user.id;
    updateObject.createdAt = notification.createdAt;
    updateObject.readAt = notification.readAt;
    updateObject.type = notification.type;
    updateObject.payload = {};

    if (notification.payload.ticket) {
      updateObject.payload.ticket = notification.payload.ticket.id;
    }

    if (notification.payload.user) {
      updateObject.payload.user = notification.payload.user.id;
    }

    if ((notification.payload as any).comment) {
      updateObject.payload.comment = (notification.payload as any).comment;
    }

    const updatedNotification = await this.notificationModel.findOneAndUpdate(
      {
        _id: notification.id,
      },
      updateObject,
    );

    return this.mapper.map(updatedNotification, NotificationDb, Notification);
  }
}
