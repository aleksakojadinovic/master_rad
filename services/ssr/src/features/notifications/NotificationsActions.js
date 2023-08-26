import { Box } from '@mui/material';
import React, { useMemo } from 'react';
import { NOTIFICATION_TYPES } from './constants';
import OpenTicketAtom from './components/atoms/OpenTicketAtom';

function NotificationsActions({ notification }) {
  const actions = useMemo(() => {
    const arr = [];
    switch (notification.type) {
      case NOTIFICATION_TYPES.COMMENT_ADDED:
        arr.push(
          <OpenTicketAtom
            id={notification.payload.ticket.Id}
            anchor={notification.payload.comment ?? null}
            notification={notification}
          />,
        );
        break;
      case NOTIFICATION_TYPES.ASSIGNED:
        arr.push(<OpenTicketAtom id={notification.payload.ticket.Id} />);
        break;
      default:
        return arr;
    }
    return arr;
  }, [notification]);

  return (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      {actions.map((action, index) => (
        <Box key={index}>{action}</Box>
      ))}
    </Box>
  );
}

export default NotificationsActions;
