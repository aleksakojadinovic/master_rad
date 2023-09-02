import { formatDate } from '@/utils';
import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import TicketStatusBadge from '../components/TicketStatusBadge';

function TicketTitleSection({ ticket }) {
  return (
    <Grid container>
      <Grid item xs={12} md={9}>
        <Box display="flex" alignItems="center" height="100%">
          <Typography variant="h4">{ticket.title}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={3}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          height="100%"
        >
          <Typography component="div" sx={{ color: 'text.disabled' }}>
            {formatDate(ticket.createdAt)}
          </Typography>
          <Typography component="div" sx={{ color: 'secondary.main' }}>
            by {ticket.createdBy.firstName} {ticket.createdBy.lastName}
          </Typography>
          <TicketStatusBadge status={ticket.status} />
        </Box>
      </Grid>
    </Grid>
  );
}

export default TicketTitleSection;
