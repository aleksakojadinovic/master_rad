import React from 'react';
import LinkIcon from '@mui/icons-material/Link';
import { IconButton } from '@mui/material';
import { useIntl } from 'react-intl';
import { notificationActions } from '@/translations/notifications';

function OpenTicketAtom({ id, anchor }) {
  const intl = useIntl();

  const handleClick = () => {
    const anchorPart = anchor ? `#${anchor}` : '';
    window.open(`/tickets/view/${id}${anchorPart}`, '_blank');
  };

  return (
    <IconButton size="small" onClick={handleClick}>
      <LinkIcon />
      {intl.formatMessage(notificationActions.openTicket)}
    </IconButton>
  );
}

export default OpenTicketAtom;
