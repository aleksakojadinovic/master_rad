import { TicketHistoryEntryType } from '@/enums/tickets';
import { notificationsMessages } from '@/translations/notifications';
import { getStringPreview } from '@/utils';
import CommentIcon from '@mui/icons-material/Comment';
import { Box, Tooltip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

function CommentPreviewAtom({ ticket, commentId }) {
  const intl = useIntl();
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
    : intl.formatMessage(notificationsMessages.previewNotAvailable);

  return (
    <Tooltip title={commentContent} placement="top" arrow>
      <Box display="flex" alignItems="center">
        <Box display="inline-flex" marginRight="8px">
          <CommentIcon />
        </Box>

        <Typography sx={{ fontSize: 16 }} color="text.primary" gutterBottom>
          <i>{commentPreview}</i>
        </Typography>
      </Box>
    </Tooltip>
  );
}

export default CommentPreviewAtom;
