import { Box } from '@mui/material';
import React from 'react';
import UserChip from '../../../components/User/UserChip';

function TicketAssignees({ assignees, onDelete }) {
  if (assignees.length === 0) {
    return null;
  }
  return (
    <Box display="flex" flexWrap="wrap">
      {assignees.map((user) => (
        <Box key={user.id} marginRight="6px">
          <UserChip
            user={user}
            onDelete={() => {
              onDelete(user);
            }}
          />
        </Box>
      ))}
    </Box>
  );
}

export default TicketAssignees;
