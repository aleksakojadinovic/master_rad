import { BaseError } from 'src/codebase/errors/BaseError';

export class DuplicateAssigneeError extends BaseError {
  constructor(assigneeId: string) {
    super(`Duplicate assignee: ${assigneeId}`);
  }
}
