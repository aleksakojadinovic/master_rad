import { Box, TextField } from '@mui/material';
import TicketStatusFilter from './TicketStatusFilter';

import React from 'react';
import { useIntl } from 'react-intl';
import { formsMessages } from '@/translations/forms';
import TicketUserFilter from './TicketUserFilter';
import { ticketSearchMessages } from '@/translations/ticket-search';

function TicketFilters({ filters, onChange }) {
  const intl = useIntl();

  const handleChange = (key, value) => {
    if (value === '') {
      const newFilters = { ...filters };
      delete newFilters[key];
      onChange(newFilters);
      return;
    }
    onChange({ ...filters, [key]: value });
  };

  return (
    <Box display="flex" flexWrap="wrap">
      <Box marginBottom="12px">
        <TextField
          size="small"
          placeholder={intl.formatMessage(formsMessages.search)}
        />
      </Box>
      <Box marginBottom="12px" marginLeft="6px">
        <TicketStatusFilter
          value={filters.status ?? ''}
          onChange={(status) => {
            handleChange('status', status);
          }}
        />
      </Box>
      <Box marginBottom="12px" marginLeft="6px">
        <TicketUserFilter
          buttonTranslation={
            ticketSearchMessages.ticketSearchAssignedToFilterTitle
          }
          value={filters.assignee ?? null}
          onChange={(userId) => handleChange('assignee', userId)}
        />
      </Box>
      <Box marginBottom="12px" marginLeft="6px">
        <TicketUserFilter
          buttonTranslation={
            ticketSearchMessages.ticketSearchCreatedByFilterTitle
          }
          value={filters.createdBy ?? null}
          onChange={(userId) => handleChange('createdBy', userId)}
        />
      </Box>
    </Box>
  );
}

export default TicketFilters;
