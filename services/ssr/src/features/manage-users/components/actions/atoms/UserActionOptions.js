import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

function UserActionOptions({ onChangeRoleClick, onChangeStatusClick }) {
  return (
    <Box display="flex" flexDirection="column" gap="3px">
      <Button
        onClick={onChangeStatusClick}
        startIcon={<ChangeCircleIcon />}
        variant="outlined"
        size="small"
      >
        <Typography variant="caption">Change status</Typography>
      </Button>
      <Button
        onClick={onChangeRoleClick}
        startIcon={<SupervisedUserCircleIcon />}
        variant="outlined"
        size="small"
        color="warning"
      >
        <Typography variant="caption">Change role</Typography>
      </Button>
    </Box>
  );
}

export default UserActionOptions;
