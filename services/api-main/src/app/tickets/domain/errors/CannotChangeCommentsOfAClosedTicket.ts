import { BaseError } from 'src/codebase/errors/BaseError';
import { TicketStatus } from '../value-objects/ticket-status';

export class CannotChangeCommentsForTicketStatus extends BaseError {
  status: TicketStatus;

  constructor(status: TicketStatus) {
    super(`This ticket is ${status}, you cannot change its comments.`);
    this.status = status;
  }

  public getPayload() {
    return { ...super.getPayload(), status: this.status };
  }
}
