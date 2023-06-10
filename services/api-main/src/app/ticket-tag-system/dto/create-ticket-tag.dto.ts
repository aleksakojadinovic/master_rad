export class CreateTicketTagDto {
  constructor(
    public name: string,
    public description: string,
    public groupId: string,
  ) {}
}
