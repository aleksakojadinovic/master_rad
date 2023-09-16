import { USER_STATUS } from '@/enums/users';
import { defineMessages } from 'react-intl';

export const userStatusMessages = defineMessages({
  [USER_STATUS.ACTIVE]: {
    id: 'user-status.active',
    defaultMessage: 'Active',
  },
  [USER_STATUS.REGISTERED]: {
    id: 'user-status.registered',
    defaultMessage: 'Registered',
  },
  [USER_STATUS.BANNED]: {
    id: 'user-status.banned',
    defaultMessage: 'Banned',
  },
});
