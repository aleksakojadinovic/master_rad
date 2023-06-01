import { TicketStatus } from '@/enums/tickets';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';
import TicketStatusBadge from '../Ticket/TicketStatusBadge';

const TICKET_STATUS_VALUES = [
  TicketStatus.NEW,
  TicketStatus.CLOSED,
  TicketStatus.OPEN,
];

function TicketStatusFilter({ value, onChange }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Status</InputLabel>
      <Select
        sx={{ height: '40px' }}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label="Age"
        onChange={handleChange}
      >
        <MenuItem value="">Any</MenuItem>
        {TICKET_STATUS_VALUES.map((ticketStatus) => (
          <MenuItem key={ticketStatus} value={ticketStatus}>
            <TicketStatusBadge status={ticketStatus} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default TicketStatusFilter;
