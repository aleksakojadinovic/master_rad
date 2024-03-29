import IntlTable from '@/components/IntlTable/IntlTable';
import { globalMessages } from '@/translations/global';
import { manageTagsMessages } from '@/translations/tags';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

function TagAdmin({ tag, onChange, onClose }) {
  // const currentLanguageCode = useContext(LanguageContext);
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
          {tag.isNew
            ? intl.formatMessage(manageTagsMessages.newTagPlaceholder)
            : tag.name}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2">{tag.description}</Typography>
      </Box>
      <Box marginTop="8px">
        <Typography variant="body2">
          {intl.formatMessage(globalMessages.name)}
        </Typography>
        <IntlTable
          value={tag.nameIntl}
          onChange={(newIntl) => onChange({ ...tag, nameIntl: newIntl })}
        />
      </Box>
      <Box marginTop="8px">
        <Typography variant="body2">
          {intl.formatMessage(globalMessages.description)}
        </Typography>
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
