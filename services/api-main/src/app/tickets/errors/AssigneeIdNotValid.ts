import { BaseError } from 'src/codebase/errors/BaseError';

export class AssigneeIdNotValidError extends BaseError {
  constructor(assigneId: string) {
    super(`Assignee id is not valid: ${assigneId}.`);
  }
}
