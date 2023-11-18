import { TicketStatus } from '../../domain/value-objects/ticket-status';

export class UpdateTicketDto {
  status?: TicketStatus;
  body?: string;
  title?: string;
}
