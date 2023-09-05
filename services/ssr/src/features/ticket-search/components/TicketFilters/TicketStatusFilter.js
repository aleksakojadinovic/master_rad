import { TICKET_STATUSES } from '@/enums/tickets';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';
import TicketStatusBadge from '../../../ticket-view/components/TicketStatusBadge';
import { useIntl } from 'react-intl';
import { ticketSearchMessages } from '@/translations/ticket-search';

const ANY_TICKET = '__ANY_TICKET__';

function TicketStatusFilter({ value, onChange }) {
  const intl = useIntl();

  const handleChange = (e) => {
    if (e.target.value === ANY_TICKET) {
      onChange('');
      return;
    }
    onChange(e.target.value);
  };

  const resolvedValue = value || ANY_TICKET;

  return (
    <FormControl>
      <InputLabel>
        {intl.formatMessage(ticketSearchMessages.ticketStatusFilterTitle)}
      </InputLabel>
      <Select
        sx={{ height: '40px', minWidth: '120px' }}
        value={resolvedValue}
        onChange={handleChange}
        label="Status"
      >
        <MenuItem value={ANY_TICKET}>
          {intl.formatMessage(ticketSearchMessages.any)}
        </MenuItem>
        {TICKET_STATUSES.map((ticketStatus) => (
          <MenuItem key={ticketStatus} value={ticketStatus}>
            <TicketStatusBadge status={ticketStatus} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default TicketStatusFilter;
