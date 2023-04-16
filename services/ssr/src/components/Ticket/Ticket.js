'use client';

import React, { Fragment } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { format } from 'date-fns';
import TicketStatusBadge from './TicketStatusBadge';
import UserCard from '../User/UserCard';
import UserChip from '../User/UserChip';

// TODO move to utils
const formatDate = (date) => {
  const d = new Date(date);
  return format(
    new Date(d.toISOString().slice(0, -1)),
    "dd/MM/yyyy 'at' hh:mm a",
  );
};

export default function Ticket({ ticket }) {
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
                {formatDate(ticket.createdAt)}
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
        <Typography variant="body1">{ticket.body}</Typography>
      </CardContent>
      <Divider />
      <CardContent>
        {ticket.comments.map((comment, index) => (
          <Card key={index} sx={{ marginTop: '12px' }}>
            <CardContent>
              <UserChip user={comment.user} />
              <Box marginTop="12px">
                <Typography variant="body2">{comment.body}</Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
