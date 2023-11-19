import {
  Alert,
  Box,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import ProfileUserInfo from '@/features/profile/components/ProfileUserInfo/ProfileUserInfo';
import { useIntl } from 'react-intl';
import { createUserMessages } from '@/translations/manage-users';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const CreateSuccess = ({ user, password }) => {
  const intl = useIntl();

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
  };

  return (
    <Box>
      <Alert severity="success">
        {intl.formatMessage(createUserMessages.createUserSuccessText)}
      </Alert>

      <ProfileUserInfo user={user} />

      <Box marginTop="12px">
        <Divider />
      </Box>

      <Typography variant="body1" marginTop="12px">
        {intl.formatMessage(createUserMessages.theirPasswordHint)}
      </Typography>
      <Box display="flex" gap="12px">
        <Box>
          <TextField disabled value={password} />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <IconButton onClick={handleCopyPassword}>
            <ContentCopyIcon />
          </IconButton>
        </Box>
      </Box>

      <Typography variant="body1" marginTop="12px">
        {intl.formatMessage(createUserMessages.notifyThem)}
      </Typography>
    </Box>
  );
};

export default CreateSuccess;
