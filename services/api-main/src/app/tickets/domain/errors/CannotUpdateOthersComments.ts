import { BaseError } from 'src/codebase/errors/BaseError';

export class CannotUpdateOthersCommentsError extends BaseError {
  constructor() {
    super("You cannot update other's people's comments.");
  }
}
