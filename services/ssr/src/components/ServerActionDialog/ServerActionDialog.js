import { dialogsMessages } from '@/translations/dialogs';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

function ServerActionDialog({
  onClose,
  message,
  indicators: { isSuccess, isError, isLoading },
}) {
  const intl = useIntl();

  const open = useMemo(
    () => isLoading || isSuccess || isError,
    [isLoading, isSuccess, isError],
  );

  const title = useMemo(() => {
    if (isSuccess) {
      return intl.formatMessage(dialogsMessages.success);
    }
    if (isError) {
      return intl.formatMessage(dialogsMessages.isError);
    }
    if (isLoading) {
      return intl.formatMessage(dialogsMessages.loading);
    }
    return null;
  }, [isLoading, isError, isSuccess, intl]);

  const severity = useMemo(() => {
    if (isSuccess) {
      return 'success';
    }
    if (isError) {
      return 'error';
    }
    if (isLoading) {
      return 'info';
    }
  }, [isError, isSuccess, isLoading]);

  const renderSpinner = () => {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  };

  const renderContent = () => {
    if (!open) {
      return null;
    }

    if (isLoading) {
      return renderSpinner();
    }
    return <Alert severity={severity}>{message ?? null}</Alert>;
  };

  console.log({ isLoading, isError, isSuccess });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{renderContent()}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          {intl.formatMessage(dialogsMessages.close)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ServerActionDialog;
