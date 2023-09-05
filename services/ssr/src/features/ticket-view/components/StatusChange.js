import { Box, Typography } from '@mui/material';
import React from 'react';
import UserChip from '../../../components/User/UserChip';
import { formatDate } from '@/utils';
import TicketStatusBadge from './TicketStatusBadge';
import { TicketStatus } from '@/enums/tickets';

export default function StatusChange({
  statusChange: { statusFrom, statusTo, user, timestamp },
}) {
  return (
    <Box display="flex" flexWrap="wrap">
      <Box>
        <UserChip user={user} />
      </Box>
      <Box marginLeft="6px" gap="10px">
        <Typography variant="caption" color="text.disabled">
          moved this from
        </Typography>
      </Box>
      <Box marginLeft="6px" gap="10px">
        <TicketStatusBadge status={statusFrom ?? TicketStatus.NEW} />
      </Box>
      <Box marginLeft="6px" gap="10px">
        <Typography variant="caption" color="text.disabled">
          to
        </Typography>
      </Box>
      <Box marginLeft="6px" gap="10px">
        <TicketStatusBadge status={statusTo} />
      </Box>
      <Box marginLeft="6px" gap="10px">
        <Typography variant="caption" color="text.disabled">
          on
        </Typography>
      </Box>
      <Box marginLeft="6px" gap="10px">
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {formatDate(timestamp)}
        </Typography>
      </Box>
    </Box>
  );
}
