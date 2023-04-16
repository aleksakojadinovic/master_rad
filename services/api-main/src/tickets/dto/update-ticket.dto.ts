import { TicketStatus } from 'src/schemas/ticket.schema';

export class UpdateTicketDto {
  status?: TicketStatus;
}
