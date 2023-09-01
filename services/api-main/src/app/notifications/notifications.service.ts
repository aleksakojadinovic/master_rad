import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './schema/notification.schema';
import { NotificationFactory } from './factory/notification.factory';
import { User } from '../users/schema/user.schema';
import { Ticket } from '../tickets/schema/ticket.schema';
import { NotificationQueryDTO } from './dto/notification-query.dto';
import { BaseService } from 'src/codebase/BaseService';
import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';
import { UsersService } from '../users/users.service';
import { FirebaseService } from '../firebase/firebase.service';
import { NotificationNotFoundError } from './errors/NotificationNotFound';

@Injectable()
export class NotificationsService extends BaseService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    private readonly usersService: UsersService,
    private readonly firebaseService: FirebaseService,
  ) {
    super();
  }

  constructPopulate(queryDTO: EntityQueryDTO): any[] {
    const populations = [];

    queryDTO.includes.forEach((includeField) => {
      if (includeField === 'users') {
        populations.push({
          path: 'users',
          model: 'User',
        });
      }
      if (includeField === 'ticket') {
        populations.push({
          path: 'payload.ticket',
          model: 'Ticket',
        });
      }
      if (includeField === 'user') {
        populations.push({
          path: 'payload.user',
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

    query.sort({ createdAt: -1 });
    query.skip((queryDTO.page - 1) * queryDTO.perPage).limit(queryDTO.perPage);

    const notifications = await query.exec();
    return notifications;
  }

  findOne(id: string) {
    return this.notificationModel.findById(id);
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
      const models = notifications.map((n) => {
        const obj = Object.assign({}, n);
        const payload = Object.assign({}, obj.payload);
        return new this.notificationModel({ ...obj, payload });
      });

      // Save notifications to the database first and populate fields
      const savedNotifications = await Promise.all(
        models.map((model) =>
          model.save().then((model) =>
            model.populate({
              path: 'users',
              model: 'User',
            }),
          ),
        ),
      );

      await this.firebaseService.sendNotifications(...savedNotifications);
      return savedNotifications;
    } catch (e) {
      return null;
    }
  }

  async markRead(id: string, user: User) {
    const notification = await this.findOne(id);

    if (!notification) {
      throw new NotificationNotFoundError();
    }

    if (
      !notification.users
        .map((user) => (user as Types.ObjectId).toString())
        .includes(user._id.toString())
    ) {
      throw new NotificationNotFoundError();
    }

    if (notification.readAt) {
      return Promise.resolve(notification);
    }

    notification.readAt = new Date();
    return notification.save();
  }
}
