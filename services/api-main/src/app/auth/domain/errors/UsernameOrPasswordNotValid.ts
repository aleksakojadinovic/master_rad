import { BaseError } from 'src/codebase/errors/BaseError';

export class UsernameOrPasswordNotValidError extends BaseError {
  constructor() {
    super('Username or password not valid');
  }
}
