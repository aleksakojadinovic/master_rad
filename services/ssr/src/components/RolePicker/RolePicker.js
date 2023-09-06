import { rolesMessages } from '@/translations/roles';
import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

function RolePicker({ roles, onSelect }) {
  const intl = useIntl();
  const options = roles.map((name, index) => ({
    id: index,
    label: intl.formatMessage(rolesMessages[name]),
  }));

  return (
    <Autocomplete
      width="100%"
      disablePortal
      options={options}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={({ label }) => label}
      renderInput={(props) => <TextField {...props} size="small" />}
      onChange={(_e, val) => {
        console.log({ roles, val });
        const selectedRole = roles.find(
          (role) => role === val.label.toLowerCase(),
        );
        if (!selectedRole) {
          return;
        }
        onSelect(selectedRole);
      }}
    />
  );
}

export default RolePicker;
