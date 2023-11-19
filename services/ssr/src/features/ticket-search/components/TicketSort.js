import { ticketSearchMessages } from '@/translations/ticket-search';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

function TicketSort({ value, onChange }) {
  const intl = useIntl();
  const options = useMemo(
    () => [
      {
        value: { sortField: 'createdAt', sortOrder: 1 },
        selectValue: 'createdAt_1',
        title: intl.formatMessage(ticketSearchMessages.dateAscending),
      },
      {
        value: { sortField: 'createdAt', sortOrder: -1 },
        selectValue: 'createdAt_-1',
        title: intl.formatMessage(ticketSearchMessages.dateDescending),
      },
    ],
    [intl],
  );

  const currentSelectValue = useMemo(() => {
    const option = options.find(
      (option) =>
        option.value.sortField === value.sortField &&
        option.value.sortOrder === value.sortOrder,
    );

    return option?.selectValue ?? '';
  }, [options, value]);

  const handleChange = (e) => {
    const sortField = e.target.value.split('_')[0];
    const sortOrder = parseInt(e.target.value.split('_')[1], 10);
    onChange({ sortField, sortOrder });
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel>
          {intl.formatMessage(ticketSearchMessages.sortBy)}
        </InputLabel>
        <Select
          sx={{ height: '40px' }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currentSelectValue}
          onChange={handleChange}
        >
          {options.map((option, index) => (
            <MenuItem key={index} value={option.selectValue}>
              {option.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default TicketSort;
