import { manageTagsMessages } from '@/translations/manage-tags';
import { Box, Divider, Typography } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

function TicketTagGroup({ id, name, description, tags, onUpdate }) {
  const intl = useIntl();
  return (
    <Box border="1px solid gray">
      <Box display="flex" alignItems="center">
        {/* TODO: Figure out how to do translations here */}
        <Typography variant="h6" color="gray">
          {intl.formatMessage(manageTagsMessages.tagNameText)}:
        </Typography>
        &nbsp;
        <Typography variant="h5">{name}</Typography>
      </Box>
      <Divider />
      <Box>
        <Typography variant="h6" color="gray">
          {intl.formatMessage(manageTagsMessages.tagDescriptionText)}:
        </Typography>
        <Typography variant="body1">{description}</Typography>
      </Box>
      <Divider />
      <Box>
        <Typography variant="h6" color="gray">
          {intl.formatMessage(manageTagsMessages.tagPermissionsText)}:
        </Typography>
      </Box>
      <Divider />
    </Box>
  );
}

export default TicketTagGroup;
