import { globalMessages } from '@/translations/global';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

function AreYouSureDialog({ open, onClose, title, body, onYes }) {
  const intl = useIntl();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{body}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {intl.formatMessage(globalMessages.no)}
        </Button>
        <Button onClick={onYes} variant="contained">
          {intl.formatMessage(globalMessages.yes)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AreYouSureDialog;
