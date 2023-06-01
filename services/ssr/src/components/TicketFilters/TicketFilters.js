import { Box, Grid, TextField, Typography } from '@mui/material';
import TicketStatusFilter from './TicketStatusFilter';

import React from 'react';

function TicketFilters({ filters, onChange }) {
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
          <TextField size="small" placeholder="Search" />
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
