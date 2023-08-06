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
    <Tooltip title={ticket.title} placement="top" arrow>
      <Box display="flex" alignItems="center">
        <Box display="inline-block" marginRight="8px">
          <ForumIcon />
        </Box>

        <Typography sx={{ fontSize: 16 }} color="text.primary" gutterBottom>
          {intl.formatMessage(
            notificationTypePayloadMessages.CommentAddedNotification,
            { ticketTitle: ticketTitlePreview },
          )}
        </Typography>
      </Box>
    </Tooltip>
  );
}

export default TicketTitlePreviewAtom;
