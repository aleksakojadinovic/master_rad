import { BaseError } from 'src/codebase/errors/BaseError';

export class CannotSearchThisRoleError extends BaseError {
  constructor(targetRole: string) {
    super(`Not allowed to search ${targetRole}s`);
  }
}
