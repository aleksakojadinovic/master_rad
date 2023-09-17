import { formsMessages } from '@/translations/forms';
import { Box, Button, TextareaAutosize } from '@mui/material';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

function CommentBodyEditing({ comment, onCancel, onSave }) {
  const intl = useIntl();
  const [value, setValue] = useState(comment.body);
  const handleChange = (e) => setValue(e.target.value);

  const canSave = comment.body !== value;

  return (
    <Box>
      <TextareaAutosize
        minRows={10}
        style={{ width: '100%' }}
        value={value}
        onChange={handleChange}
      />
      <Box display="flex" width="100%" justifyContent="flex-end" gap="12px">
        <Button onClick={onCancel}>
          {intl.formatMessage(formsMessages.cancel)}
        </Button>
        <Button
          variant="contained"
          onClick={() => onSave(value)}
          disabled={!canSave}
        >
          {intl.formatMessage(formsMessages.save)}
        </Button>
      </Box>
    </Box>
  );
}

export default CommentBodyEditing;
