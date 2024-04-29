import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import { useIntl } from 'react-intl';
import { manageUsersMessages } from '@/translations/manage-users';

function UserActionOptions({ onChangeRoleClick, onChangeStatusClick }) {
  const intl = useIntl();

  return (
    <Box display="flex" flexDirection="column" gap="3px">
      <Button
        onClick={onChangeStatusClick}
        startIcon={<ChangeCircleIcon />}
        variant="outlined"
        size="small"
      >
        <Typography variant="caption">
          {intl.formatMessage(manageUsersMessages.changeStatusTitle)}
        </Typography>
      </Button>
      <Button
        onClick={onChangeRoleClick}
        startIcon={<SupervisedUserCircleIcon />}
        variant="outlined"
        size="small"
        color="warning"
      >
        <Typography variant="caption">
          {intl.formatMessage(manageUsersMessages.changeRoleTitle)}
        </Typography>
      </Button>
    </Box>
  );
}

export default UserActionOptions;
