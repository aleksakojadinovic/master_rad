import { BaseError } from 'src/codebase/errors/BaseError';

export class NotAllowedToChangeToThisStatusError extends BaseError {
  constructor(public statusFrom: string, public statusTo: string) {
    super('You are not allowed to make this change');
  }

  public override getPayload(): { message: string; errorType: string } {
    return {
      ...super.getPayload(),
      statusFrom: this.statusFrom,
      statusTo: this.statusTo,
    };
  }
}
