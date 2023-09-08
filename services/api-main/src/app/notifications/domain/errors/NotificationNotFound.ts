import { BaseError } from 'src/codebase/errors/BaseError';

export class NotificationNotFoundError extends BaseError {
  constructor() {
    super('Notification not found');
  }
}
