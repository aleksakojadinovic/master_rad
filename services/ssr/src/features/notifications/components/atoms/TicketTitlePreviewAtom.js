import { notificationTypePayloadMessages } from '@/translations/notifications';
import { getStringPreview } from '@/utils';
import { Box, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';
import ForumIcon from '@mui/icons-material/Forum';

function TicketTitlePreviewAtom({ ticket }) {
  const intl = useIntl();
  const ticketTitlePreview = getStringPreview(ticket.title);
  return (
    <Box display="flex" alignItems="center">
      <Box display="inline-block" marginRight="8px">
        <ForumIcon />
      </Box>
      <Tooltip title={ticket.title} placement="top" arrow>
        <Typography sx={{ fontSize: 16 }} color="text.primary" gutterBottom>
          {intl.formatMessage(
            notificationTypePayloadMessages.CommentAddedNotification,
            { ticketTitle: ticketTitlePreview },
          )}
        </Typography>
      </Tooltip>
    </Box>
  );
}

export default TicketTitlePreviewAtom;
