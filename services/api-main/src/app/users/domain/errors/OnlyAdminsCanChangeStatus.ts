import { BaseError } from 'src/codebase/errors/BaseError';

export class OnlyAdminsCanChangeStatusError extends BaseError {
  constructor() {
    super('Only admins are allowed to change statuses');
  }
}
