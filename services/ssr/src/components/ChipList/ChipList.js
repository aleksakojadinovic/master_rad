import { Box, Chip } from '@mui/material';
import React from 'react';

function ChipList({ items, onClose = null }) {
  return (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      {items.map(({ id, name }) => (
        <Box key={id} marginRight="12px" marginBottom="6px">
          <Chip
            label={name}
            onDelete={onClose != null ? () => onClose({ id, name }) : undefined}
          />
        </Box>
      ))}
    </Box>
  );
}

export default ChipList;
