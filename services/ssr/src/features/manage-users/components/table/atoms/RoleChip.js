import { rolesMessages } from '@/translations/roles';
import { Chip } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

export default function RoleChip({ role }) {
  const intl = useIntl();
  const roleName = intl.formatMessage(rolesMessages[role]);

  const color =
    role === 'administrator'
      ? 'warning'
      : role === 'agent'
      ? 'primary'
      : 'default';

  return (
    <Chip size="small" color={color} variant="contained" label={roleName} />
  );
}
