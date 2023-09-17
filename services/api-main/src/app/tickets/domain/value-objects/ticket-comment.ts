import { User } from 'src/app/users/domain/entities/user.entity';

export class TicketComment {
  commentId: string;
  body: string;
  timestamp: Date;
  dateUpdated: Date;
  user: User;
  isInternal: boolean;
}
