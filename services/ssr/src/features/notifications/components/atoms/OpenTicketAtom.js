import React from 'react';
import LinkIcon from '@mui/icons-material/Link';
import { IconButton } from '@mui/material';
import { useIntl } from 'react-intl';
import { notificationActions } from '@/translations/notifications';
import { useMarkNotificationAsReadMutation } from '@/api/notifications';

function OpenTicketAtom({ id, anchor, notification }) {
  const intl = useIntl();
  const [markAsRead] = useMarkNotificationAsReadMutation();

  const handleClick = () => {
    const anchorPart = anchor ? `#${anchor}` : '';
    markAsRead({ id: notification.id }).then(() => {
      window.open(`/tickets/view/${id}${anchorPart}`, '_blank');
    });
  };

  return (
    <IconButton size="small" onClick={handleClick}>
      <LinkIcon />
      {intl.formatMessage(notificationActions.openTicket)}
    </IconButton>
  );
}

export default OpenTicketAtom;
