import { User } from 'src/app/users/domain/entities/user.entity';
import {
  CAN_ADD,
  CAN_REMOVE,
  CAN_SEE,
  TICKET_TAG_GROUP_PERMISSION_TYPE,
  TicketTagGroupPermissions,
} from '../value-objects/ticket-tag-group-permissions';
import { IntlValue } from 'src/codebase/types/IntlValue';
import { TicketTag } from './ticket-tag.entity';

export class TicketTagGroup {
  id: string;

  permissions: TicketTagGroupPermissions;

  nameIntl: IntlValue;

  descriptionIntl: IntlValue;

  tags: TicketTag[];

  public checkPermission(type: TICKET_TAG_GROUP_PERMISSION_TYPE, user: User) {
    return this.permissions[type].includes(user.role);
  }

  public canAdd(user: User) {
    return this.checkPermission(CAN_ADD, user);
  }

  public canRemove(user: User) {
    return this.checkPermission(CAN_REMOVE, user);
  }

  public canSee(user: User) {
    return this.checkPermission(CAN_SEE, user);
  }
}
