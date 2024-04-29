import { BaseError } from 'src/codebase/errors/BaseError';

export class OnlyAdminsCanChangeAIAccessError extends BaseError {
  constructor() {
    super('Only admins can change AI access.');
  }
}
