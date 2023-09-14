import { User } from 'src/app/users/domain/entities/user.entity';

export class TicketAssigneeChange {
  user: User;
  timestamp: Date;
  before: User[];
  after: User[];
}
