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
    <TicketStatusFilter
      value={filters.status ?? ''}
      onChange={(status) => {
        handleChange('status', status);
      }}
    />
  );
}

export default TicketFilters;
