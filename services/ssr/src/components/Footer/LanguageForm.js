import { globalMessages } from '@/translations/global';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

function LanguageForm() {
  const intl = useIntl();
  const [language, setLanguage] = useState('en');

  const handleChange = () => {};

  return (
    <FormControl fullWidth>
      <InputLabel>{intl.formatMessage(globalMessages.language)}</InputLabel>
      <Select value={language} label="Age" onChange={handleChange}>
        <MenuItem value={'en'}>English</MenuItem>
        <MenuItem value={'sr'}>Srpski</MenuItem>
      </Select>
    </FormControl>
  );
}

export default LanguageForm;
