import React from 'react';
import useNotificationTitle from './hooks/useNotificationTitle';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import NotificationPayload from './NotificationPayload';
import { formatDate } from '@/utils';
import NotificationsActions from './NotificationsActions';
import CheckIcon from '@mui/icons-material/Check';
import { useIntl } from 'react-intl';
import { notificationActions } from '@/translations/notifications';
import { useMarkNotificationAsReadMutation } from '@/api/notifications';

function Notification({ notification }) {
  const intl = useIntl();
  const title = useNotificationTitle(notification);
  const isRead = notification.readAt !== null;

  const [markAsRead] = useMarkNotificationAsReadMutation();

  const cardStyles = isRead
    ? { width: '250px' }
    : {
        width: '250px',
        backgroundColor: '#E3F2FD',
        border: '3px solid #0D47A1',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      };

  const handleMarkAsRead = () => {
    markAsRead({ id: notification.id });
  };

  return (
    <Box position="relative">
      <Card sx={cardStyles}>
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
          {!isRead && (
            <Tooltip
              title={intl.formatMessage(notificationActions.markAsRead)}
              placement="top"
              arrow
            >
              <Box display="inline-block">
                <IconButton onClick={handleMarkAsRead}>
                  <CheckIcon />
                </IconButton>
              </Box>
            </Tooltip>
          )}
        </CardActions>
      </Card>
    </Box>
  );
}

export default Notification;
