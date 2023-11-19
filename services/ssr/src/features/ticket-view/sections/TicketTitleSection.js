import { formatDate } from '@/utils';
import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import TicketStatusBadge from '../components/TicketStatusBadge';
import { useIntl } from 'react-intl';
import { globalMessages } from '@/translations/global';
import useUser from '@/hooks/useUser';

function TicketTitleSection({ ticket }) {
  const intl = useIntl();

  const { id } = useUser();
  const isOwner = id === ticket.createdBy.id;

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
            {formatDate(ticket.createdAt, intl)}
          </Typography>
          <Typography component="div" sx={{ color: 'secondary.main' }}>
            {intl.formatMessage(globalMessages.by)} {ticket.createdBy.fullName}
          </Typography>
          <TicketStatusBadge status={ticket.status} />
        </Box>
      </Grid>
    </Grid>
  );
}

export default TicketTitleSection;
