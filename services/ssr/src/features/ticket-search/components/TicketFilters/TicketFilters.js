import { Box, Button, Divider } from '@mui/material';
import TicketStatusFilter from './TicketStatusFilter';

import React, { Fragment, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { formsMessages } from '@/translations/forms';
import TicketUserFilter from './TicketUserFilter';
import { ticketSearchMessages } from '@/translations/ticket-search';
import TicketSort from '../TicketSort';
import TicketTagFilter from './TicketTagFilter';

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

  const handleSortChange = ({ sortField, sortOrder }) => {
    onChange({ ...filters, sortField, sortOrder });
  };

  const handleReset = () => {
    onChange({});
  };

  const hasAnyFilters = useMemo(
    () => Object.keys(filters).length > 0,
    [filters],
  );

  return (
    <Fragment>
      <Box display="flex" flexWrap="wrap" gap="6px">
        <Box>
          <TicketStatusFilter
            value={filters.statuses ?? ''}
            onChange={(status) => {
              handleChange('statuses', status ? [status] : '');
            }}
          />
        </Box>
        <Box>
          <TicketUserFilter
            buttonTranslation={
              ticketSearchMessages.ticketSearchAssignedToFilterTitle
            }
            value={filters.assignee ?? null}
            onChange={(userId) => handleChange('assignee', userId)}
          />
        </Box>
        <Box>
          <TicketUserFilter
            buttonTranslation={
              ticketSearchMessages.ticketSearchCreatedByFilterTitle
            }
            value={filters.createdBy ?? null}
            onChange={(userId) => handleChange('createdBy', userId)}
          />
        </Box>
        <Box>
          <TicketSort
            value={{
              sortField: filters.sortField,
              sortOrder: filters.sortOrder,
            }}
            onChange={handleSortChange}
          />
        </Box>
        <Box>
          <TicketTagFilter
            value={filters.tags || []}
            onChange={(newTagIds) => handleChange('tags', newTagIds.join(','))}
          />
        </Box>
      </Box>
      <Box marginTop="12px">
        <Divider />
      </Box>
      <Box marginTop="12px" alignItems="center">
        <Button
          variant="contained"
          size="small"
          onClick={handleReset}
          disabled={!hasAnyFilters}
        >
          {intl.formatMessage(formsMessages.resetFilters)}
        </Button>
      </Box>
    </Fragment>
  );
}

export default TicketFilters;
