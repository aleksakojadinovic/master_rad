import { STATUS_COLOR_MAP } from '@/features/manage-users/constants/status-map';
import { userStatusMessages } from '@/translations/user-status';
import { Chip } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

export default function UserStatusChip({ status }) {
  const intl = useIntl();
  const label = intl.formatMessage(userStatusMessages[status]);

  return (
    <Chip
      size="small"
      color={STATUS_COLOR_MAP[status] ?? 'primary'}
      variant="contained"
      label={label}
    />
  );
}
