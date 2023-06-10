import { BaseError } from 'src/codebase/errors/BaseError';

export class TicketTagNameAlreadyExistsError extends BaseError {
  constructor() {
    super('Ticket tag name already exists');
  }
}
