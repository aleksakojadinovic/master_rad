import { BaseError } from 'src/codebase/errors/BaseError';

export class TicketTooLongError extends BaseError {
  constructor() {
    super('This ticket is too long to use AI services');
  }
}
