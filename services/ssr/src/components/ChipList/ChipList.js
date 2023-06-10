import { Box, Chip } from '@mui/material';
import React from 'react';

function ChipList({ items, onClose = null }) {
  return (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      {items.map(({ id, name }) => (
        <Chip
          key={id}
          label={name}
          onDelete={onClose != null ? () => onClose(id) : undefined}
        />
      ))}
    </Box>
  );
}

export default ChipList;
