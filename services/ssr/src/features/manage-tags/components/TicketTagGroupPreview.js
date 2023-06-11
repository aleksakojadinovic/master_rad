import { useTagDescription, useTagName } from '@/features/tags/utils';
import { Box, Grid, Typography } from '@mui/material';
import React from 'react';

function TicketTagGroupPreview({ group }) {
  const name = useTagName(group);
  const description = useTagDescription(group);

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
            {name}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">{description}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TicketTagGroupPreview;
