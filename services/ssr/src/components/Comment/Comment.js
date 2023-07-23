import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Typography } from '@mui/material';
import UserChip from '../User/UserChip';
import { formatDate } from '@/utils';

export default function Comment({ comment }) {
  return (
    <div id={comment.commentId ?? ''}>
      <Card>
        <CardContent>
          <Box
            display="flex"
            sx={{
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'normal', md: 'center' },
            }}
          >
            <Box>
              <UserChip user={comment.user} />
            </Box>
            <Box sx={{ marginLeft: { xs: 0, md: '12px' } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {formatDate(comment.timestamp)}
              </Typography>
            </Box>
          </Box>

          <Box marginTop="12px">
            <Typography variant="body2">{comment.body}</Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
