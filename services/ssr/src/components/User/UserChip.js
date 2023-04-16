'use client';

import { Avatar, Chip } from '@mui/material';
import React from 'react';

export default function UserChip({ user: { firstName, lastName } }) {
  const initials = `${firstName[0]}${lastName[0]}`;
  const fullName = `${firstName} ${lastName}`;
  return (
    <Chip
      size="small"
      color="primary"
      variant="contained"
      avatar={<Avatar sx={{ bgcolor: 'blue' }}>{initials}</Avatar>}
      label={fullName}
    />
  );
}
