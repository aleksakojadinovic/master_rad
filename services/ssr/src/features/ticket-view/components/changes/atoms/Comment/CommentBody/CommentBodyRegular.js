import { Typography } from '@mui/material';
import React from 'react';

function CommentBodyRegular({ comment }) {
  return <Typography variant="body2">{comment.body}</Typography>;
}

export default CommentBodyRegular;
