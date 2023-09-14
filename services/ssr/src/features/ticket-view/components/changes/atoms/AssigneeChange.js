import UserChip from '@/components/User/UserChip';
import { ticketViewMessages } from '@/translations/ticket-view';
import { formatDate } from '@/utils';
import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

function AssigneeChange({ item: { added, removed, timestamp, user } }) {
  const intl = useIntl();
  const dateFormatted = formatDate(timestamp);

  const renderChange = (isAdd) => {
    const users = isAdd ? added : removed;
    if (users.length === 0) {
      return null;
    }

    const actionTranslation = isAdd
      ? ticketViewMessages.hasAssigned
      : ticketViewMessages.hasUnassigned;

    return (
      <Card>
        <CardContent>
          <Box display="flex" flexWrap="wrap" gap="12px">
            <UserChip user={user} />
            <Box>
              <Typography variant="caption">
                {intl.formatMessage(actionTranslation)}
              </Typography>
            </Box>

            <Box display="flex" flexWrap="wrap" gap="12px">
              {users.map((u) => (
                <UserChip key={u.id} user={u} />
              ))}
            </Box>
            <Box display="flex">
              <Typography variant="caption">
                {intl.formatMessage(ticketViewMessages.dateOn)}
              </Typography>
            </Box>

            <Box display="flex">
              <Typography variant="caption">
                <Box>{dateFormatted}</Box>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      {renderChange(true)}
      {renderChange(false)}
    </div>
  );
}

export default AssigneeChange;
