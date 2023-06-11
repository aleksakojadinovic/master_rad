export class CreateTicketTagGroupDTO {
  constructor(
    public name: string,
    public exclusive: boolean,
    public canCreatorAdd: boolean,
    public canCreatorRemove: boolean,
    public canAddRoles: string[],
    public canRemoveRoles: string[],
  ) {}
}
