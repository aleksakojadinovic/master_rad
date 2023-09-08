import { Role } from 'src/app/users/domain/value-objects/role';

export class TicketTagGroupPermissionsDTO {
  constructor(
    public canAddRoles: Role[],
    public canRemoveRoles: Role[],
    public canSeeRoles: Role[],
  ) {}
}
