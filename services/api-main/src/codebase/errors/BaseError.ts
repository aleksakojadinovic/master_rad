export class BaseError {
  constructor(public message: string = 'An error occurred') {}

  public getName() {
    return this.constructor.name;
  }

  public getPayload(): any {
    return {
      message: this.message,
      errorType: this.getName(),
    };
  }
}
