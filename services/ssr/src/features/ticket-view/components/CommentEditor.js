import { Box, Button, TextareaAutosize } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';

function CommentEditor({ onSubmit, isSubmitDisabled, isSuccess }) {
  const [comment, setComment] = useState('');

  const handleChange = (e) => setComment(e.target.value);

  const handleSubmit = () => onSubmit(comment);

  useEffect(() => {
    if (isSuccess) {
      setComment('');
    }
  }, [isSuccess]);

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
        <Button
          variant="contained"
          disabled={comment.length === 0 || isSubmitDisabled}
          onClick={handleSubmit}
        >
          Post
        </Button>
      </Box>
    </Fragment>
  );
}

export default CommentEditor;
