import { Role } from 'src/app/users/domain/value-objects/role';

export class TicketTagGroupPermissionsDTO {
  canAdd: Role[];
  canRemove: Role[];
  canSee: Role[];
}
