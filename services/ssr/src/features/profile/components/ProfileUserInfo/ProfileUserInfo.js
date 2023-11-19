import { Box, Typography } from '@mui/material';
import React from 'react';
import UserStatusChip from '@/features/manage-users/components/table/atoms/UserStatusChip';
import RoleChip from '@/features/manage-users/components/table/atoms/RoleChip';
import { useIntl } from 'react-intl';
import { profileMessages } from '@/translations/profile';

function ProfileUserInfo({ user }) {
  const intl = useIntl();
  const { role, username, fullName, status } = user;

  return (
    <Box display="flex" width="100%" flexDirection="column" gap="12px">
      <Box display="flex" gap="16px" alignItems="center">
        <Typography variant="body2" fontWeight="bold">
          {intl.formatMessage(profileMessages.usernameTitle)}
        </Typography>
        <Typography variant="body1">{username}</Typography>
      </Box>
      <Box display="flex" gap="16px" alignItems="center">
        <Typography variant="body2" fontWeight="bold">
          {intl.formatMessage(profileMessages.nameTitle)}
        </Typography>
        <Typography variant="body1">{fullName}</Typography>
      </Box>
      <Box display="flex" gap="16px" alignItems="center">
        <Typography variant="body2" fontWeight="bold">
          {intl.formatMessage(profileMessages.statusTitle)}
        </Typography>
        <Box>
          <UserStatusChip status={status} />
        </Box>
      </Box>
      <Box display="flex" gap="16px" alignItems="center">
        <Typography variant="body2" fontWeight="bold">
          {intl.formatMessage(profileMessages.roleTitle)}
        </Typography>
        <Box>
          <RoleChip role={role} />
        </Box>
      </Box>
    </Box>
  );
}

export default ProfileUserInfo;
