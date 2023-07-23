import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schema/notification.schema';
import { NotificationFactory } from './factory/notification.factory';
import { User } from '../users/schema/user.schema';
import { Ticket } from '../tickets/schema/ticket.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

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

  async createCommentNotification(
    notifiedUsers: User[],
    commenter: User,
    ticket: Ticket,
    commentId: string,
    timestamp: Date,
  ) {
    const notification = NotificationFactory.create((builder) =>
      builder
        .forUsers(notifiedUsers)
        .atTimestamp(timestamp)
        .hasPayload('comment_added', (commentBuilder) =>
          commentBuilder
            .atTicket(ticket)
            .byUser(commenter)
            .hasCommentId(commentId),
        ),
    );

    const model = new this.notificationModel(notification);
    await model.save();
  }

  async emitNotifications(...notifications: Notification[]) {
    const models = notifications.map((n) => new this.notificationModel(n));
    await Promise.all(models.map((model) => model.save()));
  }
}
