import { Avatar, Chip } from '@mui/material';
import React from 'react';

export default function UserChip({
  user: { firstName, lastName, fullName, role },
  onClick,
  onDelete,
}) {
  console.log(firstName, lastName);
  const initials = `${firstName?.[0] ?? '/'}${lastName?.[0] ?? '/'}`;

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
      label={fullName}
      onClick={onClick ?? undefined}
      onDelete={onDelete ?? undefined}
    />
  );
}
