import { useTagDescription, useTagName } from '@/features/tags/utils';
import { Chip, Tooltip } from '@mui/material';
import React from 'react';

function TagAdmin({ tag }) {
  const resolvedName = useTagName(tag);
  const resolvedDescription = useTagDescription(tag);

  return (
    <Tooltip title={resolvedDescription}>
      <Chip label={resolvedName} />
    </Tooltip>
  );
}

export default TagAdmin;
