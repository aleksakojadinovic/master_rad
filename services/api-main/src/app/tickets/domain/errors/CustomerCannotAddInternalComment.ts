import { BaseError } from 'src/codebase/errors/BaseError';

export class CustomerCannotAddInternalCommmentError extends BaseError {
  constructor() {
    super('You cannot add an internal comment as a customer.');
  }
}
