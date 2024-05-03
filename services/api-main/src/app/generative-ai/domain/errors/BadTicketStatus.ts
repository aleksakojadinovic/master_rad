import { BaseError } from 'src/codebase/errors/BaseError';

export class BadTicketStatusError extends BaseError {
  constructor() {
    super('You cannot use AI services for ticket in this status.');
  }
}
