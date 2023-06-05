import { BaseError } from './BaseError';

export class InvalidFilterKeyError extends BaseError {
  constructor(filterKey: string) {
    super(`Invalid filter key: ${filterKey}`);
  }
}
