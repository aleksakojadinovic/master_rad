import { ROLES } from '@/constants/roles';
import { globalMessages } from '@/translations/global';
import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

function RoleFilter({ value, onChange }) {
  const intl = useIntl();
  return (
    <Autocomplete
      size="small"
      options={ROLES}
      value={value}
      onChange={(_event, newRole) => {
        onChange(newRole ?? null);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{ minWidth: '220px' }}
          variant="outlined"
          size="small"
          label={intl.formatMessage(globalMessages.roles)}
        />
      )}
    />
  );
}

export default RoleFilter;
