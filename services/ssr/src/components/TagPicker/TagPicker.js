import { Autocomplete, TextField } from '@mui/material';
import React, { useState } from 'react';

function TagPicker({ tags, onSelect, title }) {
  const [key, setKey] = useState(1);

  return (
    <Autocomplete
      key={key}
      sx={{ width: '250px' }}
      disablePortal
      options={tags}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={({ name }) => name}
      groupBy={(option) => option.groupName || option.group.name || 'N/A'}
      renderInput={(props) => (
        <TextField {...props} size="small" placeholder={title} />
      )}
      onChange={(_e, val) => {
        const selectedTag = tags.find((tag) => tag.id === val.id);
        if (!selectedTag) {
          return;
        }
        setKey((k) => k + 1);
        onSelect(selectedTag.id);
      }}
    />
  );
}

export default TagPicker;
