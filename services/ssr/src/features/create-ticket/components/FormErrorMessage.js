import { Alert, Typography } from '@mui/material';
import React from 'react';

function FormErrorMessage({ text }) {
  return (
    <Alert severity="error">
      <Typography variant="caption">{text}</Typography>
    </Alert>
  );
}

export default FormErrorMessage;
