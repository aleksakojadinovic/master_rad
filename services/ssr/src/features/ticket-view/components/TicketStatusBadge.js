import { TicketStatus } from '@/enums/tickets';
import { ticketStatusMessages } from '@/translations/statuses';
import { Box, Chip } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

export default function TicketStatusBadge({ status }) {
  const intl = useIntl();
  const displayText = intl.formatMessage(ticketStatusMessages[status]);

  const resolveChip = () => {
    switch (status.toString()) {
      case TicketStatus.NEW:
        return (
          <Chip
            label={displayText}
            size="small"
            color="primary"
            variant="outlined"
          />
        );
      case TicketStatus.OPEN:
        return (
          <Chip
            label={displayText}
            size="small"
            color="warning"
            variant="outlined"
          />
        );
      case TicketStatus.CLOSED:
        return (
          <Chip
            label={displayText}
            size="small"
            color="error"
            variant="outlined"
          />
        );
      case TicketStatus.IN_PROGRESS:
        return (
          <Chip
            label={displayText}
            size="small"
            color="info"
            variant="outlined"
          />
        );
      case TicketStatus.RESOLVED:
        return (
          <Chip
            label={displayText}
            size="small"
            color="success"
            variant="outlined"
          />
        );
      default:
        return displayText;
    }
  };

  return <Box>{resolveChip()}</Box>;
}
