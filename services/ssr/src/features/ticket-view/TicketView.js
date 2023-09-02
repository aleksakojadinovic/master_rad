import React, { Fragment } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Divider, Typography } from '@mui/material';
import TicketAssigneeSection from './sections/TicketAssigneeSection';
import TicketTitleSection from './sections/TicketTitleSection';
import TicketTagSection from './sections/TicketTagSection';
import TicketTimelineSection from './sections/TicketTimelineSection';
import TicketCommentSection from './sections/TicketCommentSection';
import TicketStatusSection from './sections/TicketStatusSection';
import ServerActionSnackbar from '@/components/ServerActionSnackbar/ServerActionSnackbar';
import { useUpdateTicketMutation } from '@/api/tickets';
import { useIntl } from 'react-intl';
import { queryStatusMessages } from '@/translations/query-statuses';
import { globalMessages } from '@/translations/global';

export default function TicketView({ ticket }) {
  const intl = useIntl();
  const [, { error, isLoading, isSuccess, isError }] = useUpdateTicketMutation({
    fixedCacheKey: 'ticket-view-page',
  });
  return (
    <Fragment>
      <ServerActionSnackbar
        error={error}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        successMessage={intl.formatMessage(
          queryStatusMessages.updateSuccessfulX,
          { x: intl.formatMessage(globalMessages.ticket) },
        )}
      />
      <Card variant="outlined">
        <CardContent>
          <TicketTitleSection ticket={ticket} />
        </CardContent>
        <Divider />
        <TicketAssigneeSection ticket={ticket} />
        <Divider />
        <TicketTagSection ticket={ticket} />
        <Divider />
        <TicketStatusSection ticket={ticket} />
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
