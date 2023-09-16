import { USER_STATUS } from '@/enums/users';
import { userStatusMessages } from '@/translations/user-status';
import { Chip } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

export default function UserStatusChip({ status }) {
  const intl = useIntl();
  const label = intl.formatMessage(userStatusMessages[status]);

  const color =
    status === USER_STATUS.ACTIVE
      ? 'success'
      : status === USER_STATUS.REGISTERED
      ? 'warning'
      : status === USER_STATUS.BANNED
      ? 'danger'
      : 'primary';

  return <Chip size="small" color={color} variant="contained" label={label} />;
}
