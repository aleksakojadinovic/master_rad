import { Autocomplete, TextField } from '@mui/material';
import React from 'react';

function RolePicker({ roles }) {
  const options = roles.map(({ id, name }) => ({ id, label: name }));
  return (
    <Autocomplete
      width="100%"
      disablePortal
      options={options}
      renderInput={(props) => <TextField {...props} size="small" />}
    />
  );
}

export default RolePicker;
