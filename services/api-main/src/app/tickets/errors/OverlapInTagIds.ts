import { BaseError } from 'src/codebase/errors/BaseError';

export class OverlapInTagIdsError extends BaseError {
  constructor() {
    super('Cannot add and remove tag at the same time');
  }
}
