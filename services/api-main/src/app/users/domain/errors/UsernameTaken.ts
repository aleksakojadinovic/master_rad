import { BaseError } from 'src/codebase/errors/BaseError';

export class UsernameTakenError extends BaseError {
  constructor() {
    super(`This username is already taken`);
  }
}
