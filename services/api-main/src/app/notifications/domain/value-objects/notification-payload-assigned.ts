import { Ticket } from 'src/app/tickets/domain/entities/ticket.entity';
import { User } from 'src/app/users/domain/entities/user.entity';

export class NotificationPayloadAssigned {
  ticket: Ticket;

  user: User;
}
