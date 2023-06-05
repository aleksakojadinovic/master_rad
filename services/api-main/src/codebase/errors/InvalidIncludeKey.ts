import { BaseError } from './BaseError';

export class InvalidIncludeKeyError extends BaseError {
  constructor(key: string) {
    super(`Invalid include key: ${key}.`);
  }
}
