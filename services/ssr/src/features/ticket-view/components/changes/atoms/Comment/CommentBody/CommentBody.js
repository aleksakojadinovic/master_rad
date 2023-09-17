import React from 'react';
import CommentBodyRegular from './CommentBodyRegular';
import CommentBodyEditing from './CommentBodyEditing';

function CommentBody({ isEditing, ...props }) {
  if (!isEditing) {
    return <CommentBodyRegular {...props} />;
  }
  return <CommentBodyEditing {...props} />;
}

export default CommentBody;
