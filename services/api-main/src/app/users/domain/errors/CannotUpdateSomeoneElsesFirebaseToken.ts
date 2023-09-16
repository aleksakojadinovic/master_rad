import { BaseError } from 'src/codebase/errors/BaseError';

export class CannotUpdateSomeoneElsesFirebaseTokenError extends BaseError {
  constructor() {
    super("You cannot update someone else's firebase token");
  }
}
