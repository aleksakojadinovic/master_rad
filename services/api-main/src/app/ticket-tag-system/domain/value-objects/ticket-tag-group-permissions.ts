import { Role } from 'src/app/users/domain/value-objects/role';

export const CAN_SEE = 'CAN_SEE';
export const CAN_ADD = 'CAN_ADD';
export const CAN_REMOVE = 'CAN_REMOVE';

export type TICKET_TAG_GROUP_PERMISSION_TYPE =
  | typeof CAN_SEE
  | typeof CAN_ADD
  | typeof CAN_REMOVE;

export type TicketTagGroupPermissions = {
  [CAN_SEE]: Role[];
  [CAN_ADD]: Role[];
  [CAN_REMOVE]: Role[];
};
