import IntlTable from '@/components/IntlTable/IntlTable';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import React from 'react';

function TagAdmin({ tag, onChange }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      padding="12px"
      border="1px solid gray"
    >
      <Box>
        <Typography variant="body1" color="gray">
          {tag.name}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2">{tag.description}</Typography>
      </Box>
      <Box marginTop="8px">
        <IntlTable
          value={tag.nameIntl}
          onChange={(newIntl) => onChange({ ...tag, nameIntl: newIntl })}
        />
      </Box>
      <Box marginTop="8px">
        <IntlTable
          value={tag.descriptionIntl}
          onChange={(newIntl) => onChange({ ...tag, descriptionIntl: newIntl })}
        />
      </Box>
      <Box>
        <Button>Delete</Button>
      </Box>
    </Box>
  );
}

export default TagAdmin;
