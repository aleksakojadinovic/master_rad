import { BaseError } from 'src/codebase/errors/BaseError';

export class NotAllowedToSearchOthersTicketsAsACustomerError extends BaseError {
  constructor() {
    super("Not allowed to search others' tickets.");
  }
}
