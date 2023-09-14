import { BaseError } from 'src/codebase/errors/BaseError';

export class TicketIdNotValidError extends BaseError {
  constructor(ticketId: string) {
    super(`Ticket id not valid: ${ticketId}.`);
  }
}
