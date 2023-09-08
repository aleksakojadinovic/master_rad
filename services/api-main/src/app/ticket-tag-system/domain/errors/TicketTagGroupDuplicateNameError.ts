import { BaseError } from 'src/codebase/errors/BaseError';

export class TicketTagGroupDuplicateNameError extends BaseError {
  constructor() {
    super('Duplicate tag name');
  }
}
