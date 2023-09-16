import { globalMessages } from '@/translations/global';
import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDebounce } from 'use-debounce';

function SearchBox({ value, onChange }) {
  const intl = useIntl();

  const [val, setVal] = useState(value);
  const [debouncedVal] = useDebounce(val, 300);

  const handleChange = (e) => {
    setVal(e.target.value);
  };

  useEffect(() => {
    if (debouncedVal !== value) {
      onChange(debouncedVal);
    }
  }, [debouncedVal, value, onChange]);

  return (
    <TextField
      placeholder={intl.formatMessage(globalMessages.search)}
      size="small"
      value={value}
      onChange={handleChange}
    />
  );
}

export default SearchBox;
