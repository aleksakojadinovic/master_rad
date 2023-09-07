import { TicketHistoryEntry } from '../value-objects/ticket-history';
import { TicketStatus } from '../value-objects/ticket-status';

export class Ticket {
  id: string;

  title: string;

  body: string;

  status: TicketStatus;

  history: TicketHistoryEntry[];
}
