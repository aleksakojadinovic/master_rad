import { BaseError } from 'src/codebase/errors/BaseError';

export class CannotRemoveAndAddOrUpdateTicketTagError extends BaseError {
  constructor() {
    super('Cannot remove and add/update ticket tag at the same time');
  }
}
