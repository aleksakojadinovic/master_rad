import { Autocomplete, TextField } from '@mui/material';
import React, { useState } from 'react';

function RolePicker({ roles, onSelect }) {
  const options = roles.map(({ id, name }) => ({ id, label: name }));
  return (
    <Autocomplete
      width="100%"
      disablePortal
      options={options}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(props) => <TextField {...props} size="small" />}
      onSelect={(e) => {
        const selectedRole = roles.find((role) => role.name === e.target.value);
        if (!selectedRole) {
          return;
        }
        onSelect(selectedRole);
      }}
    />
  );
}

export default RolePicker;
