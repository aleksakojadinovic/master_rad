import { BaseError } from 'src/codebase/errors/BaseError';

export class AssigneeNotFoundError extends BaseError {
  constructor() {
    super('Assignee not found');
  }
}
