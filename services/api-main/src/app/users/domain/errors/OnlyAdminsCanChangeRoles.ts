import { BaseError } from 'src/codebase/errors/BaseError';

export class OnlyAdminsCanChangeRolesError extends BaseError {
  constructor() {
    super('Only admins can change roles.');
  }
}
