import { BaseError } from './BaseError';

export class InvalidSortKeyError extends BaseError {
  constructor(key: string) {
    super(`Invalid sort key: ${key}`);
  }
}
