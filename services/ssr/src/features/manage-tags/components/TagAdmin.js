import { useTagDescription, useTagName } from '@/features/tags/utils';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import React from 'react';

function TagAdmin({ tag }) {
  const resolvedName = useTagName(tag);
  const resolvedDescription = useTagDescription(tag);

  return (
    <Tooltip title={resolvedDescription}>
      <Box
        display="flex"
        flexDirection="column"
        padding="12px"
        border="1px solid gray"
      >
        <Box>
          <Typography variant="body2" color="gray">
            {tag.nameIntlKey}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1">{resolvedName}</Typography>
        </Box>
        <Box>
          <Button>Delete</Button>
        </Box>
      </Box>
    </Tooltip>
  );
}

export default TagAdmin;
