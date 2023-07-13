import { Autocomplete, TextField } from '@mui/material';
import React from 'react';

function TagPicker({ tags, onSelect }) {
  return (
    <Autocomplete
      sx={{ width: '250px' }}
      disablePortal
      options={tags}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={({ name }) => name}
      groupBy={(option) => option.groupName}
      renderInput={(props) => <TextField {...props} size="small" />}
      onChange={(_e, val) => {
        const selectedTag = tags.find((tag) => tag.id === val.id);
        if (!selectedTag) {
          return;
        }
        onSelect(selectedTag.id);
      }}
    />
  );
}

export default TagPicker;
