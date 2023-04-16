'use client';

import { TicketStatus, TicketStatusText } from '@/enums/tickets';
import { Box, Chip } from '@mui/material';
import React from 'react';

export default function TicketStatusBadge({ status }) {
  const displayText = TicketStatusText[status];

  const resolveChip = () => {
    switch (status) {
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
            color="success"
            variant="outlined"
          />
        );
      default:
        return displayText;
    }
  };

  return <Box sx={{ width: '70px' }}>{resolveChip()}</Box>;
}
