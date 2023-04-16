'use client';

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Divider, Grid, Typography } from '@mui/material';
import { format } from 'date-fns';

export default function Ticket({ ticket }) {
  const date = new Date(ticket.createdAt);

  console.log({ ticket });
  const createdAtDisplay = format(
    new Date(date.toISOString().slice(0, -1)),
    "dd/MM/yyyy 'at' hh:mm a",
  );
  return (
    <Card variant="outlined">
      <Grid>
        <Grid item xs={12}>
          <CardContent>
            <Typography variant="h4">{ticket.title}</Typography>
          </CardContent>
        </Grid>
        <Grid item xs={12}>
          <CardContent>
            <Typography variant="h6" component="div">
              {createdAtDisplay}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>

      <Divider />
      <CardContent>
        <Typography variant="p">{ticket.body}</Typography>
      </CardContent>
    </Card>
  );
}
