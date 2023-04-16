'use client';

import { Avatar, Box, Chip, Typography } from '@mui/material';
import React from 'react';

export default function UserCard({ user: { firstName, lastName, roles } }) {
  const initials = `${firstName[0]}${lastName[0]}`;
  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" alignItems="center">
        <Box>
          <Avatar sx={{ width: '35px', height: '35px', bgcolor: 'info.main' }}>
            {initials}
          </Avatar>
        </Box>
        <Box sx={{ marginLeft: '5px' }}>
          <Typography variant="caption">
            {firstName} {lastName}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap' }}>
        {roles.map((role, index) => (
          <Chip
            key={index}
            size="small"
            variant="contained"
            label={role}
            sx={{ width: '50px' }}
          />
        ))}
      </Box>
    </Box>
  );
}
