'use client';

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { format } from 'date-fns';
import TicketStatusBadge from './TicketStatusBadge';

export default function Ticket({ ticket }) {
  const date = new Date(ticket.createdAt);

  console.log({ ticket });
  const createdAtDisplay = format(
    new Date(date.toISOString().slice(0, -1)),
    "dd/MM/yyyy 'at' hh:mm a",
  );
  return (
    <Card variant="outlined">
      <CardContent>
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
                {createdAtDisplay}
              </Typography>
              <Typography component="div" sx={{ color: 'secondary.main' }}>
                by {ticket.createdUser.firstName} {ticket.createdUser.lastName}
              </Typography>
              <TicketStatusBadge status={ticket.status} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />
      <CardContent>
        <Typography variant="p">{ticket.body}</Typography>
      </CardContent>
    </Card>
  );
}
