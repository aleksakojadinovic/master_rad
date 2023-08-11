import React from 'react';
import useNotificationTitle from './hooks/useNotificationTitle';
import { Box, Card, CardActions, CardContent, Typography } from '@mui/material';
import NotificationPayload from './NotificationPayload';
import { formatDate } from '@/utils';
import NotificationsActions from './NotificationsActions';

function Notification({ notification }) {
  const title = useNotificationTitle(notification);

  return (
    <Box>
      <Card sx={{ width: '250px' }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {formatDate(notification.createdAt)}
          </Typography>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <NotificationPayload notification={notification} />
        </CardContent>
        <CardActions>
          <NotificationsActions notification={notification} />
        </CardActions>
      </Card>
    </Box>
  );
}

export default Notification;
