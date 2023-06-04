import { BaseError } from 'src/codebase/errors/BaseError';

export class TicketNotFoundError extends BaseError {
  constructor(ticketId: string) {
    super(`Ticket not found for id: ${ticketId}.`);
  }
}
