import { TicketStatus } from '../types';

export class UpdateTicketDto {
  status?: TicketStatus;
  body?: string;
  comment?: string;
}
