import { BaseError } from 'src/codebase/errors/BaseError';

export class CommentNotFoundError extends BaseError {
  constructor() {
    super('Comment not found');
  }
}
