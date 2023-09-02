import React, { Fragment } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Divider, Typography } from '@mui/material';
import TicketAssigneeSection from './sections/TicketAssigneeSection';
import TicketTitleSection from './sections/TicketTitleSection';
import TicketTagSection from './sections/TicketTagSection';
import TicketTimelineSection from './sections/TicketTimelineSection';
import TicketCommentSection from './sections/TicketCommentSection';

export default function Ticket({ ticket }) {
  return (
    <Fragment>
      <Card variant="outlined">
        <CardContent>
          <TicketTitleSection ticket={ticket} />
        </CardContent>
        <Divider />
        <TicketAssigneeSection ticket={ticket} />
        <Divider />
        <TicketTagSection ticket={ticket} />
        <Divider />
        <CardContent>
          <Typography variant="body1">{ticket.body}</Typography>
        </CardContent>
        <CardContent>
          <TicketTimelineSection ticket={ticket} />
        </CardContent>
        <Box marginTop="12px">
          <Divider />
          <Card>
            <CardContent>
              <TicketCommentSection ticket={ticket} />
            </CardContent>
          </Card>
        </Box>
      </Card>
    </Fragment>
  );
}
