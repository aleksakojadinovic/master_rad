import { BaseError } from 'src/codebase/errors/BaseError';

export class DuplicateTagError extends BaseError {
  constructor() {
    super('Duplicate tag found');
  }
}
