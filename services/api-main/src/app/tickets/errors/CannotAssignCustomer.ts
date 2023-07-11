import { BaseError } from 'src/codebase/errors/BaseError';

export class CannotAssignCustomerError extends BaseError {
  constructor(customerId: string) {
    super(`Cannot assign a customer to a ticket: ${customerId}`);
  }
}
