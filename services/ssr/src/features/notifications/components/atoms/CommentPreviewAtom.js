import { notificationsMessages } from '@/translations/notifications';
import { getStringPreview } from '@/utils';
import CommentIcon from '@mui/icons-material/Comment';
import { Box, Tooltip, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

function CommentPreviewAtom({ ticket, commentId }) {
  const intl = useIntl();

  const comment = ticket.comments.find(({ commentId: id }) => id === commentId);
  const commentContent = comment?.body;

  const commentPreview = commentContent
    ? getStringPreview(commentContent)
    : intl.formatMessage(notificationsMessages.previewNotAvailable);

  return (
    <Box display="flex" alignItems="center">
      <Box display="inline-flex" marginRight="8px">
        <CommentIcon />
      </Box>
      <Tooltip title={commentContent} placement="top" arrow>
        <Typography sx={{ fontSize: 16 }} color="text.primary" gutterBottom>
          <i>{commentPreview}</i>
        </Typography>
      </Tooltip>
    </Box>
  );
}

export default CommentPreviewAtom;
