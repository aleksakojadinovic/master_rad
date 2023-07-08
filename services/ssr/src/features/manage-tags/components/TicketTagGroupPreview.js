import { Box, Grid, Typography } from '@mui/material';
import React from 'react';

function TicketTagGroupPreview({ group }) {
  return (
    <Box
      onClick={() => {
        window.open(`/manage/tags/edit/${group.id}`, '_blank');
      }}
      sx={{ cursor: 'pointer' }}
    >
      <Grid container sx={{ border: '1px solid gray', padding: '3px' }}>
        <Grid item xs={2}>
          <Typography variant="h5" color="pallete.info.dark">
            {group.name}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6">{group.description}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TicketTagGroupPreview;