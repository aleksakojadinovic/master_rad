import { BaseError } from 'src/codebase/errors/BaseError';

export class NotAllowedToAssignError extends BaseError {
  constructor() {
    super('Customers cannot assign');
  }
}
