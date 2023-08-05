import React from 'react';
import useNotificationTitle from './hooks/useNotificationTitle';
import { Box, Typography } from '@mui/material';

function Notification({ notification }) {
  const title = useNotificationTitle(notification);
  return (
    <Box>
      <Typography variant="body1">{title}</Typography>
    </Box>
  );
}

export default Notification;
