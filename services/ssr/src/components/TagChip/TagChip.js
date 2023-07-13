import { Box, Chip, Typography } from '@mui/material';
import React from 'react';

function TagChip({
  tag: {
    name,
    // description,
    group: { name: groupName },
  },
}) {
  return (
    <Chip
      label={
        <Box>
          <Typography variant="body2">{groupName}</Typography>
          <Typography variant="body1">{name}</Typography>
        </Box>
      }
    />
  );
}

export default TagChip;
