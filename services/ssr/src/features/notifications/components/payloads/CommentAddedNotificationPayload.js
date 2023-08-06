import { Box } from '@mui/material';
import React from 'react';

import UserChip from '@/components/User/UserChip';
import TicketTitlePreviewAtom from '../atoms/TicketTitlePreviewAtom';
import CommentPreviewAtom from '../atoms/CommentPreviewAtom';

function CommentAddedNotificationPayload({ notification }) {
  const { payload } = notification;

  const { comment: commentId, ticket, user } = payload;

  return (
    <Box>
      <TicketTitlePreviewAtom ticket={ticket} />
      <CommentPreviewAtom ticket={ticket} commentId={commentId} />

      <Box display="flex" alignItems="center">
        <UserChip user={user} />
      </Box>
    </Box>
  );
}

export default CommentAddedNotificationPayload;
