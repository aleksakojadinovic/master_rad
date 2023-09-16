import { globalMessages } from '@/translations/global';
import { TextField } from '@mui/material';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

function SearchBox({ value: outerValue, onChange }) {
  const intl = useIntl();

  const [value, setValue] = useState(outerValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <TextField
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onChange(value);
        }
      }}
      placeholder={intl.formatMessage(globalMessages.search)}
      size="small"
      value={value}
      onChange={handleChange}
    />
  );
}

export default SearchBox;
