import { Box, Chip, Divider, Tooltip, Typography } from '@mui/material';
import React, { Fragment } from 'react';

function TagChip({ tag: { id, name, description, canDelete }, onDelete }) {
  const handleDelete = !canDelete ? undefined : () => onDelete(id);

  const renderTooltipContent = () => {
    return (
      <Fragment>
        <Typography variant="body1">{description}</Typography>
        <Divider />
      </Fragment>
    );
  };

  return (
    <Tooltip title={renderTooltipContent()}>
      <Box>
        <Chip
          onDelete={handleDelete}
          label={
            <Box>
              <Typography variant="body1">{name}</Typography>
            </Box>
          }
        />
      </Box>
    </Tooltip>
  );
}

export default TagChip;
