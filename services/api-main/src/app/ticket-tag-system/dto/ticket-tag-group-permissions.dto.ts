import { RoleDTO } from 'src/app/users/dto/role.dto';

export class TicketTagGroupPermissionsDTO {
  constructor(
    public canAddRoles: RoleDTO[] | string[],
    public canRemoveRoles: RoleDTO[] | string[],
    public canSeeRoles: RoleDTO[] | string[],
  ) {}
}
