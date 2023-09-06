import { rolesMessages } from '@/translations/roles';
import { Avatar, Chip } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

export default function UserChip({
  user: { firstName, lastName, fullName, role },
  includeRole = false,
  onClick,
  onDelete,
}) {
  const intl = useIntl();
  const initials = `${firstName?.[0] ?? '/'}${lastName?.[0] ?? '/'}`;
  const roleName = intl.formatMessage(rolesMessages[role]);

  const roleText = includeRole ? ` (${roleName.toLowerCase()})` : '';
  const label = `${fullName}${roleText}`;

  const color =
    role === 'customer'
      ? 'default'
      : role === 'administrator'
      ? 'warning'
      : 'primary';

  return (
    <Chip
      size="small"
      color={color}
      variant="contained"
      avatar={<Avatar>{initials}</Avatar>}
      label={label}
      onClick={onClick ?? undefined}
      onDelete={onDelete ?? undefined}
    />
  );
}
