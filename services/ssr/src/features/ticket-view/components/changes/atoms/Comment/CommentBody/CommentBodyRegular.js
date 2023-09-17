import { Typography } from '@mui/material';
import React from 'react';

function CommentBodyRegular({ comment }) {
  return (
    <Typography variant="body2" as="div">
      <pre>{comment.body}</pre>
    </Typography>
  );
}

export default CommentBodyRegular;
