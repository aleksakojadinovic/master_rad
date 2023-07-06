import IntlTable from '@/components/IntlTable/IntlTable';
import { LanguageContext } from '@/context/LanguageContext';
import { globalMessages } from '@/translations/global';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useIntl } from 'react-intl';

function TagAdmin({ tag, onChange, onClose }) {
  const currentLanguageCode = useContext(LanguageContext);
  const intl = useIntl();
  return (
    <Box
      display="flex"
      flexDirection="column"
      padding="12px"
      border="1px solid gray"
    >
      <Box>
        <Typography variant="body1" color="gray">
          {tag.name}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2">{tag.description}</Typography>
      </Box>
      <Box marginTop="8px">
        <IntlTable
          value={tag.nameIntl}
          onChange={(newIntl) => onChange({ ...tag, nameIntl: newIntl })}
        />
      </Box>
      <Box marginTop="8px">
        <IntlTable
          value={tag.descriptionIntl}
          onChange={(newIntl) => onChange({ ...tag, descriptionIntl: newIntl })}
        />
      </Box>
      <Box>
        <Button onClick={onClose}>
          {intl.formatMessage(globalMessages.delete)}
        </Button>
      </Box>
    </Box>
  );
}

export default TagAdmin;
