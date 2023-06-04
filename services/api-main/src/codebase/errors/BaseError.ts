export class BaseError {
  constructor(
    public message: string = 'An error occurred',
    public context: any = {},
  ) {}
}
