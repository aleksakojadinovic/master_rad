import { notificationTypePayloadMessages } from '@/translations/notifications';
import { getStringPreview } from '@/utils';
import { Box, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';
import ForumIcon from '@mui/icons-material/Forum';
import UserChip from '@/components/User/UserChip';
import { TicketHistoryEntryType } from '@/enums/tickets';
import { useMemo } from 'react';
import CommentIcon from '@mui/icons-material/Comment';

function CommentAddedNotificationPayload({ notification }) {
  const intl = useIntl();

  const { payload } = notification;

  const { comment: commentId, ticket, user } = payload;

  const ticketTitlePreview = getStringPreview(ticket.title);

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
      <Tooltip title={ticket.title} placement="top" arrow>
        <Box display="flex" alignItems="center">
          <Box display="inline-block" marginRight="8px">
            <ForumIcon />
          </Box>

          <Typography sx={{ fontSize: 16 }} color="text.primary" gutterBottom>
            {intl.formatMessage(
              notificationTypePayloadMessages.CommentAddedNotification,
              { ticketTitle: ticketTitlePreview },
            )}
          </Typography>
        </Box>
      </Tooltip>

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
