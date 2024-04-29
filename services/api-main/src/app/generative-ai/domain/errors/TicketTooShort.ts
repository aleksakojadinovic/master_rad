import { BaseError } from 'src/codebase/errors/BaseError';

export class TicketTooShortError extends BaseError {
  constructor() {
    super('This ticket is too short to use AI');
  }
}
