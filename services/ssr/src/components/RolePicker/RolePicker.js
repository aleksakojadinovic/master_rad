import { rolesMessages } from '@/translations/roles';
import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

function RolePicker({ roles, onSelect }) {
  const intl = useIntl();
  const options = roles.map(({ id, name }) => ({
    id,
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
        const selectedRole = roles.find((role) => role.id === val.id);
        if (!selectedRole) {
          return;
        }
        onSelect(selectedRole);
      }}
    />
  );
}

export default RolePicker;
