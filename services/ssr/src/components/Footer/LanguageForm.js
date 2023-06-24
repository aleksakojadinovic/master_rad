import { LanguageContext } from '@/context/LanguageContext';
import { globalMessages } from '@/translations/global';
import { isServer } from '@/utils';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Cookies from 'js-cookie';
import React, { useContext, useState } from 'react';
import { useIntl } from 'react-intl';

function LanguageForm() {
  const intl = useIntl();
  const languageCode = useContext(LanguageContext);

  const handleChange = (e) => {
    Cookies.set('language_code', e.target.value);
    location.reload();
  };

  return (
    <FormControl>
      <InputLabel>{intl.formatMessage(globalMessages.language)}</InputLabel>
      <Select
        value={languageCode}
        label="Age"
        onChange={handleChange}
        size="small"
      >
        <MenuItem value={'en'}>English</MenuItem>
        <MenuItem value={'sr'}>Srpski</MenuItem>
      </Select>
    </FormControl>
  );
}

export default LanguageForm;
