import { ticketViewMessages } from '@/translations/ticket-view';
import { Box, Button, TextareaAutosize } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

function CommentEditor({
  onSubmit,
  isSubmitDisabled,
  isSuccess,
  isInternal,
  initialValue = '',
}) {
  const intl = useIntl();
  const [comment, setComment] = useState(initialValue);

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
        placeholder={intl.formatMessage(
          isInternal
            ? ticketViewMessages.addInternalCommentPlaceholder
            : ticketViewMessages.addPublicCommentPlaceholder,
        )}
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
