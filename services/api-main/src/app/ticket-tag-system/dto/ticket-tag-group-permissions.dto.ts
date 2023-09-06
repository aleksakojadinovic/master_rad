import { Role } from 'src/app/users/schema/role.schema';

export class TicketTagGroupPermissionsDTO {
  constructor(
    public canAddRoles: Role[],
    public canRemoveRoles: Role[],
    public canSeeRoles: Role[],
  ) {}
}
