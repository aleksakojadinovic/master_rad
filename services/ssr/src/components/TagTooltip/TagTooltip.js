import { Tooltip, Typography } from '@mui/material';
import React from 'react';

function TagTooltip({ description }) {
  return (
    <Tooltip title="Add" arrow>
      <Typography variant="body2">{description}</Typography>
    </Tooltip>
  );
}

export default TagTooltip;
