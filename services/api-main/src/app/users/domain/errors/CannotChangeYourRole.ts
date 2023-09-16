import { BaseError } from 'src/codebase/errors/BaseError';

export class CannotChangeYourRoleError extends BaseError {
  constructor() {
    super('You cannot change your role.');
  }
}
