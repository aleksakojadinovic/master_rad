import { Box, Grid, TextField } from '@mui/material';
import TicketStatusFilter from './TicketStatusFilter';

import React from 'react';
import { useIntl } from 'react-intl';
import { formsMessages } from '@/translations/forms';

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
    <Box height="40px">
      <Grid container>
        <Grid item xs={12} sm={3}>
          <TextField
            size="small"
            placeholder={intl.formatMessage(formsMessages.search)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TicketStatusFilter
            value={filters.status ?? ''}
            onChange={(status) => {
              handleChange('status', status);
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default TicketFilters;
