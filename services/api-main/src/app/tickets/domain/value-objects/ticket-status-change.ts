import { User } from 'src/app/users/domain/entities/user.entity';
import { TicketStatus } from './ticket-status';

export class TicketStatusChange {
  statusFrom: TicketStatus;

  statusTo: TicketStatus;

  timestamp: Date;

  user: User;
}
