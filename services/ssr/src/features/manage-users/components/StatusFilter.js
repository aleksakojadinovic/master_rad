import { USER_STATUSES } from '@/enums/users';
import { globalMessages } from '@/translations/global';
import { userStatusMessages } from '@/translations/user-status';
import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

function StatusFilter({ value, onChange }) {
  const intl = useIntl();
  return (
    <Autocomplete
      size="small"
      options={USER_STATUSES}
      getOptionLabel={(option) =>
        intl.formatMessage(userStatusMessages[option])
      }
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
          label={intl.formatMessage(globalMessages.status)}
        />
      )}
    />
  );
}

export default StatusFilter;
