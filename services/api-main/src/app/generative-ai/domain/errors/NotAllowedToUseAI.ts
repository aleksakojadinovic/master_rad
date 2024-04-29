import { BaseError } from 'src/codebase/errors/BaseError';

export class NotAllowedToUseAIError extends BaseError {
  constructor() {
    super('You are not allowed to use AI.');
  }
}
