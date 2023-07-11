import { BaseError } from 'src/codebase/errors/BaseError';

export class NotAllowedToRemoveThisTagError extends BaseError {
  constructor() {
    super('You are not remove to add this tag');
  }
}
