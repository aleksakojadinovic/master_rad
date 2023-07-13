import { Box, Typography } from '@mui/material';
import React from 'react';

function TicketTagGroupPreview({ group }) {
  return (
    <Box
      onClick={() => {
        window.open(`/manage/tags/edit/${group.id}`, '_blank');
      }}
      sx={{ cursor: 'pointer' }}
    >
      <Box sx={{ border: '1px solid gray', padding: '3px' }}>
        <Typography variant="h5" color="pallete.info.dark">
          {group.name}
        </Typography>
        <Typography variant="h6">{group.description}</Typography>
      </Box>
    </Box>
  );
}

export default TicketTagGroupPreview;
