import { Box, Button, TextareaAutosize } from '@mui/material';
import React, { Fragment, useState } from 'react';

function CommentEditor() {
  const [comment, setComment] = useState('');

  const handleChange = (e) => setComment(e.target.value);

  return (
    <Fragment>
      <TextareaAutosize
        minRows={10}
        placeholder="Add a comment..."
        style={{ width: '100%' }}
        value={comment}
        onChange={handleChange}
      />
      <Box display="flex" flexDirection="row-reverse">
        <Button variant="contained" disabled={comment.length === 0}>
          Post
        </Button>
      </Box>
    </Fragment>
  );
}

export default CommentEditor;
