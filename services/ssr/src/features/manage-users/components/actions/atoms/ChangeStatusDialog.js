import { manageUsersMessages } from '@/translations/manage-users';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

function ChangeStatusDialog({ open, onClose }) {
  const intl = useIntl();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {intl.formatMessage(manageUsersMessages.changeStatusTitle)}
      </DialogTitle>
      <DialogContent>blabla</DialogContent>
    </Dialog>
  );
}

export default ChangeStatusDialog;
