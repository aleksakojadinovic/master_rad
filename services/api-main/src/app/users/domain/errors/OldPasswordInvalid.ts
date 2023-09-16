import { BaseError } from 'src/codebase/errors/BaseError';

export class OldPasswordInvalidError extends BaseError {
  constructor() {
    super('Old password is wrong');
  }
}
