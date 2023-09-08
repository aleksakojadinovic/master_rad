import { BaseError } from 'src/codebase/errors/BaseError';

export class TicketTagNotFoundError extends BaseError {
  constructor() {
    super('Ticket tag not found');
  }
}
