import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

function FullPageSpinner({ open }) {
  return (
    <Backdrop open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default FullPageSpinner;
