import { BaseError } from './BaseError';

export class PaginationRequiredError extends BaseError {
  constructor() {
    super('Pagination is required.');
  }
}
