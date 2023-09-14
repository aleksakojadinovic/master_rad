import { User } from 'src/app/users/domain/entities/user.entity';

export class TicketComment {
  // Represents an absolute index of history item when this happened
  changeIndex: number;
  commentId: string;
  body: string;
  timestamp: Date;
  user: User;
  isInternal: boolean;
}
