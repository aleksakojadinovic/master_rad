import { BaseError } from 'src/codebase/errors/BaseError';

export class CannotChangeSomeoneElsesPasswordError extends BaseError {
  constructor() {
    super('You cannot change someone elses password');
  }
}
