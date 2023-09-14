import { User } from 'src/app/users/domain/entities/user.entity';
import { TicketStatus } from './ticket-status';

export class TicketStatusChange {
  // Represents the absolute index of history item when this happened
  changeIndex: number;

  statusFrom: TicketStatus;

  statusTo: TicketStatus;

  timestamp: Date;

  user: User;
}
