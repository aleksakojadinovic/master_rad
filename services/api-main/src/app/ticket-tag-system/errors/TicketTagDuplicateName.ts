import { BaseError } from 'src/codebase/errors/BaseError';

export class TicketTagDuplicateNameError extends BaseError {
  constructor() {
    super('Duplicate tag name');
  }
}
