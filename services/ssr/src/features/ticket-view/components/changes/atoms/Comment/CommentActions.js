import { CardHeader, IconButton } from '@mui/material';
import React, { Fragment } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function CommentActions({ onEditClick, onDeleteClick }) {
  return (
    <CardHeader
      action={
        <Fragment>
          <IconButton onClick={onEditClick}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={onDeleteClick}>
            <DeleteIcon />
          </IconButton>
        </Fragment>
      }
    />
  );
}

export default CommentActions;
