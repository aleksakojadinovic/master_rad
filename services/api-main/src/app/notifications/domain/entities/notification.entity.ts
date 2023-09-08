import { User } from 'src/app/users/domain/entities/user.entity';
import { NotificationPayload } from '../value-objects/notification-payload';

export class Notification {
  id: string;

  user: User;

  createdAt: Date;

  readAt: Date | null;

  type: string;

  payload: NotificationPayload;
}
