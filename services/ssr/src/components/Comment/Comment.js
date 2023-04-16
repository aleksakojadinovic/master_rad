import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Grid, Typography } from '@mui/material';
import UserChip from '../User/UserChip';
import { formatDate } from '@/utils';
import styled from '@emotion/styled';

export default function Comment({ comment }) {
  return (
    <Card sx={{ marginTop: '12px' }}>
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
      <CommentHeaderContainer />
    </Card>
  );
}

const CommentHeaderContainer = styled(Box)`
  ${({ theme }) => console.log({ theme })}
`;
