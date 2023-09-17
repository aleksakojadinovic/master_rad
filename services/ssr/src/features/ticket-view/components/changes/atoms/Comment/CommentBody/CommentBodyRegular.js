import { Typography } from '@mui/material';
import React from 'react';

function CommentBodyRegular({ comment }) {
  return (
    <Typography
      variant="body2"
      as="div"
      style={{
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      }}
    >
      {comment.body}
    </Typography>
  );
}

export default CommentBodyRegular;
