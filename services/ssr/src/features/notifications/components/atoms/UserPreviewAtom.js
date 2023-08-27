import UserChip from '@/components/User/UserChip';
import { Box } from '@mui/material';
import React from 'react';

function UserPreviewAtom({ user }) {
  return (
    <Box display="flex" alignItems="center">
      <UserChip user={user} />
    </Box>
  );
}

export default UserPreviewAtom;
