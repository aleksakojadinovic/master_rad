import { BaseError } from './BaseError';

export class InvalidPaginationParametersError extends BaseError {
  constructor() {
    super('Invalid pagination parameters');
  }
}
