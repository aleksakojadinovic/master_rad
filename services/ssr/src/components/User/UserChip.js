import { Avatar, Chip } from '@mui/material';
import React from 'react';

export default function UserChip({ user: { firstName, lastName, roles } }) {
  const initials = `${firstName[0]}${lastName[0]}`;
  const fullName = `${firstName} ${lastName}`;

  const variant = roles.map((role) => role.name).includes('agent')
    ? 'contained'
    : 'outlined';

  return (
    <Chip
      size="small"
      color="primary"
      variant={variant}
      avatar={<Avatar sx={{ bgcolor: 'blue' }}>{initials}</Avatar>}
      label={fullName}
    />
  );
}
