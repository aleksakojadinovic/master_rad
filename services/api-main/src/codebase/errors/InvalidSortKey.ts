import { BaseError } from './BaseError';

export class InvalidSortKey extends BaseError {
  constructor(key: string) {
    super(`Invalid sort key: ${key}`);
  }
}
