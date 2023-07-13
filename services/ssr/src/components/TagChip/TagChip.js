import { Box, Chip, Typography } from '@mui/material';
import React from 'react';

function TagChip({ tag: { name } }) {
  return (
    <Chip
      label={
        <Box>
          <Typography variant="body1">{name}</Typography>
        </Box>
      }
    />
  );
}

export default TagChip;
