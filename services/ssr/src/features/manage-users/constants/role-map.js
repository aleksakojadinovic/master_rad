import { ROLE } from '@/enums/roles';

export const ROLE_CHANGE_MAP = {
  [ROLE.ADMINISTRATOR]: [ROLE.AGENT],
  [ROLE.AGENT]: [ROLE.ADMINISTRATOR],
  [ROLE.CUSTOMER]: [ROLE.AGENT],
};
