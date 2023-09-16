import { BaseError } from 'src/codebase/errors/BaseError';

export class CannotChangeYourStatusError extends BaseError {
  constructor() {
    super('Cannot change your own status');
  }
}
