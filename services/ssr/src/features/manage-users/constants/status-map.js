import { USER_STATUS } from '@/enums/users';

export const STATUS_COLOR_MAP = {
  [USER_STATUS.ACTIVE]: 'success',
  [USER_STATUS.REGISTERED]: 'warning',
  [USER_STATUS.BANNED]: 'error',
};
