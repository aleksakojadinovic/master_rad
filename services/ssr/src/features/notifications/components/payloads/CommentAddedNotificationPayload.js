import { getStringPreview } from '@/utils';
import { Box, Tooltip, Typography } from '@mui/material';
import React from 'react';

import UserChip from '@/components/User/UserChip';
import { TicketHistoryEntryType } from '@/enums/tickets';
import { useMemo } from 'react';
import CommentIcon from '@mui/icons-material/Comment';
import TicketTitlePreviewAtom from '../atoms/TicketTitlePreviewAtom';

function CommentAddedNotificationPayload({ notification }) {
  const { payload } = notification;

  const { comment: commentId, ticket, user } = payload;

  const commentEntry = useMemo(
    () =>
      ticket.history
        .filter((item) => {
          return item.entryType === TicketHistoryEntryType.COMMENT_ADDED;
        })
        .find((item) => {
          return item.entry.commentId === commentId;
        }),
    [ticket.history, commentId],
  );

  const commentContent = commentEntry?.entry?.body ?? null;

  const commentPreview = commentContent
    ? getStringPreview(commentContent)
    : null;

  return (
    <Box>
      <TicketTitlePreviewAtom ticket={ticket} />

      {commentPreview && (
        <Tooltip title={commentContent} placement="top" arrow>
          <Box display="flex" alignItems="center">
            <Box display="inline-flex" marginRight="8px">
              <CommentIcon />
            </Box>

            <Typography sx={{ fontSize: 16 }} color="text.primary" gutterBottom>
              {commentPreview}
            </Typography>
          </Box>
        </Tooltip>
      )}

      <Box display="flex" alignItems="center">
        <UserChip user={user} />
      </Box>
    </Box>
  );
}

export default CommentAddedNotificationPayload;
