import useServerMessage from '@/hooks/useServerMessage';
import { Alert, Box, CircularProgress, Snackbar } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';

function ServerActionSnackbar({
  isSuccess,
  isError,
  isLoading,
  successMessage,
  error,
}) {
  const [open, setOpen] = useState(false);
  const { severity, message } = useServerMessage({
    isError,
    isSuccess,
    successMessage,
    error,
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (isSuccess || isError) {
      setOpen(true);
    }
  }, [isSuccess, isError]);

  return (
    <Fragment>
      {isLoading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Fragment>
  );
}

export default ServerActionSnackbar;
