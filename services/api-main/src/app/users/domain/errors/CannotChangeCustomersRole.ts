import { BaseError } from 'src/codebase/errors/BaseError';

export class CannotChangeCustomersRoleError extends BaseError {
  constructor() {
    super("Cannot change customer's role.");
  }
}
