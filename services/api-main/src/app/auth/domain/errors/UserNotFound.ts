import { BaseError } from 'src/codebase/errors/BaseError';

export class UserNotFoundError extends BaseError {
  constructor() {
    super('User not found');
  }
}
