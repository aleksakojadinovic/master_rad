import { Box } from '@mui/material';
import React from 'react';

import TicketTitlePreviewAtom from '../atoms/TicketTitlePreviewAtom';
import UserPreviewAtom from '../atoms/UserPreviewAtom';

function AssignedNotificationPayload({ notification }) {
  const { payload } = notification;

  const { ticket, user } = payload;

  return (
    <Box>
      <TicketTitlePreviewAtom ticket={ticket} />
      <UserPreviewAtom user={user} />
    </Box>
  );
}

export default AssignedNotificationPayload;
