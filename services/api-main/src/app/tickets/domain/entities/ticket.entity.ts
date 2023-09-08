import { User } from 'src/app/users/domain/entities/user.entity';
import { TicketHistoryEntry } from '../value-objects/ticket-history';
import { TicketStatus } from '../value-objects/ticket-status';
import { TicketComment } from '../value-objects/ticket-comment';
import { TicketStatusChange } from '../value-objects/ticket-status-change';

export class Ticket {
  id: string;

  title: string;

  body: string;

  createdBy: User;

  status: TicketStatus;

  assignees: User[];

  tags: any[];

  history: TicketHistoryEntry[];

  comments: TicketComment[];

  statusChanges: TicketStatusChange[];
}
