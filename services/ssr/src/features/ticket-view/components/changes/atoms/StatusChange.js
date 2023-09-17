import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import UserChip from '../../../../../components/User/UserChip';
import { formatDate } from '@/utils';
import TicketStatusBadge from '../../TicketStatusBadge';
import { useIntl } from 'react-intl';
import { ticketViewMessages } from '@/translations/ticket-view';

export default function StatusChange({
  item: { statusFrom, statusTo, user, timestamp },
}) {
  const intl = useIntl();
  return (
    <Card>
      <CardContent>
        <Box display="flex" flexWrap="wrap" gap="6px">
          <Box>
            <UserChip user={user} />
          </Box>
          <Box>
            <Typography variant="caption" color="text.disabled">
              {intl.formatMessage(ticketViewMessages.movedFrom)}
            </Typography>
          </Box>
          <Box>
            <TicketStatusBadge status={statusFrom} />
          </Box>
          <Box>
            <Typography variant="caption" color="text.disabled">
              {intl.formatMessage(ticketViewMessages.movedTo)}
            </Typography>
          </Box>
          <Box>
            <TicketStatusBadge status={statusTo} />
          </Box>
          <Box>
            <Typography variant="caption" color="text.disabled">
              {intl.formatMessage(ticketViewMessages.movedOn)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {formatDate(timestamp, intl)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
