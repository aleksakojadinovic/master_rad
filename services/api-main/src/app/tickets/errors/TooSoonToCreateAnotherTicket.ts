import { BaseError } from 'src/codebase/errors/BaseError';

export class TooSoonToCreateAnotherTicketError extends BaseError {
  constructor(previousCreatedAgo: number, waitTime: number) {
    super(
      `You've submitted a ticket ${previousCreatedAgo} minutes ago. Please wait another ${waitTime} minutes before submitting a new one.`,
    );
  }
}
