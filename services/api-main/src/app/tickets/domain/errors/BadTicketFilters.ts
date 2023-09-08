import { BaseError } from 'src/codebase/errors/BaseError';

export class BadTicketFiltersError extends BaseError {
  constructor(msg = '') {
    super(msg);
  }
}
