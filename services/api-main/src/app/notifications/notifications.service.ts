import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schema/notification.schema';
import { NotificationFactory } from './factory/notification.factory';
import { User } from '../users/schema/user.schema';
import { Ticket } from '../tickets/schema/ticket.schema';
import { NotificationQueryDTO } from './dto/notification-query.dto';
import { BaseService } from 'src/codebase/BaseService';
import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';

@Injectable()
export class NotificationsService extends BaseService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {
    super();
  }

  override constructPopulate(queryDTO: EntityQueryDTO): any[] {
    const populations = [];
    queryDTO.includes.forEach((includeField) => {
      if (includeField === 'users') {
        populations.push({
          path: 'users',
          model: 'User',
        });
      }
    });
    return populations;
  }

  create() {
    return 'This action adds a new notification';
  }

  async findAll(queryDTO: NotificationQueryDTO, user: User) {
    const query = this.notificationModel.find({ users: { $in: user._id } });

    const populations = this.constructPopulate(queryDTO);
    populations.forEach((p) => query.populate(p));

    const notifications = await query.exec();
    return notifications;
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
    try {
      console.log('--------> ORIGINAL PAYLOAD <-------------');
      console.log(typeof notifications[0].payload);
      const models = notifications.map((n) => {
        const obj = Object.assign({}, n);
        const payload = Object.assign({}, obj.payload);
        return new this.notificationModel({ ...obj, payload });
      });
      console.log('--------> PAYLOAD <-------------');
      console.log(typeof models[0].payload);
      // console.log(JSON.stringify(models[0], null, 4));
      // console.log(JSON.stringify(models[0].payload, null, 4));
      const result = await Promise.all(models.map((model) => model.save()));
      return result;
    } catch (e) {
      // console.log(e);
      return null;
    }
  }
}
