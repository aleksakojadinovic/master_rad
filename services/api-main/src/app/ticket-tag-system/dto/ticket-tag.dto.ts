export class TicketTagDTO {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public nameIntlKey: string,
    public descriptionIntlKey: string,
  ) {}
}
