import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useIntl } from 'react-intl';
import { manageUsersMessages } from '@/translations/manage-users';

function UserActionOptions({
  user,
  onChangeRoleClick,
  onChangeStatusClick,
  onToggleAIClick,
}) {
  const intl = useIntl();

  const aiButtonTranslation = user.canUseAI
    ? manageUsersMessages.revokeAIAccess
    : manageUsersMessages.grantAIAccess;

  const aiButtonColor = user.canUseAI ? 'error' : 'primary';

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
      <Button
        onClick={onToggleAIClick}
        startIcon={<SmartToyIcon />}
        variant="outlined"
        size="small"
        color={aiButtonColor}
      >
        <Typography variant="caption">
          {intl.formatMessage(aiButtonTranslation)}
        </Typography>
      </Button>
    </Box>
  );
}

export default UserActionOptions;
