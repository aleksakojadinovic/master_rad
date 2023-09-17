import UserChip from '@/components/User/UserChip';
import { ticketViewMessages } from '@/translations/ticket-view';
import { formatDate } from '@/utils';
import { Box, Chip, Tooltip, Typography } from '@mui/material';
import React from 'react';

function CommentHead({ comment }) {
  return (
    <Box
      display="flex"
      sx={{
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'normal', md: 'center' },
      }}
    >
      <Box>
        <UserChip user={comment.user} includeRole />
      </Box>
      <Box sx={{ marginLeft: { xs: 0, md: '12px' } }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {formatDate(comment.timestamp)}
        </Typography>
      </Box>
      {comment.isInternal && (
        <Tooltip
          title={Intl.formatMessage(ticketViewMessages.internalCommentNote)}
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
