import { Avatar, Chip } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import React from 'react';

export default function UserChip({ user: { firstName, lastName, roles } }) {
  const initials = `${firstName[0]}${lastName[0]}`;
  const fullName = `${firstName} ${lastName}`;
  const color = roles.map((role) => role.name).includes('agent')
    ? 'primary'
    : 'success';

  const avatarBgColor = roles.map((role) => role.name).includes('agent')
    ? 'blue'
    : deepOrange[500];

  return (
    <Chip
      size="small"
      color={color}
      variant="contained"
      avatar={<Avatar sx={{ bgcolor: avatarBgColor }}>{initials}</Avatar>}
      label={fullName}
    />
  );
}
