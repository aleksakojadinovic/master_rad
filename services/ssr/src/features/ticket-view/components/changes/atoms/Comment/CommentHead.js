import UserChip from '@/components/User/UserChip';
import { ticketViewMessages } from '@/translations/ticket-view';
import { formatDate } from '@/utils';
import { Box, Chip, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

function CommentHead({ comment }) {
  const intl = useIntl();
  return (
    <Box display="flex" flexWrap="wrap" gap="6px">
      <Box>
        <UserChip user={comment.user} includeRole />
      </Box>
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {formatDate(comment.timestamp, intl)}
        </Typography>
      </Box>
      <Box>|</Box>
      {comment.updatedAt && (
        <Box sx={{ marginLeft: { xs: 0, md: '12px' } }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {intl.formatMessage(ticketViewMessages.editedAtX, {
              x: formatDate(comment.updatedAt, intl),
            })}
          </Typography>
        </Box>
      )}
      {comment.isInternal && (
        <Tooltip
          title={intl.formatMessage(ticketViewMessages.internalCommentNote)}
          placement="top"
        >
          <Box
            sx={{
              marginLeft: { xs: 0, md: '12px' },
              display: 'inline-block',
            }}
          >
            <Chip label="INTERNAL" color="warning" />
          </Box>
        </Tooltip>
      )}
    </Box>
  );
}

export default CommentHead;
