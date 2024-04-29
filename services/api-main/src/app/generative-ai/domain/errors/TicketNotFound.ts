import { BaseError } from 'src/codebase/errors/BaseError';

export class TicketNotFoundError extends BaseError {
  constructor() {
    super('Ticket not found.');
  }
}
