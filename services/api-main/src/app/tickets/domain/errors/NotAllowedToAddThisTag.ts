import { BaseError } from 'src/codebase/errors/BaseError';

export class NotAllowedToAddThisTagError extends BaseError {
  constructor() {
    super('You are not allowed to add this tag');
  }
}
