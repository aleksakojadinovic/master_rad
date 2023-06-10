import { RoleDTO } from 'src/app/users/dto/role.dto';

export class TicketTagGroupPermissionsDTO {
  constructor(
    public canCreatorAdd: boolean,
    public canCreatorRemove: boolean,
    public canAddRoles: (string | RoleDTO)[],
    public canRemoveRoles: (string | RoleDTO)[],
  ) {}
}
