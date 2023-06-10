import { BaseError } from 'src/codebase/errors/BaseError';

export class TicketTagGroupNotFoundError extends BaseError {
  constructor() {
    super('Ticket tag group not found');
  }
}
