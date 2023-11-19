import { Box } from '@mui/material';
import React, { useState } from 'react';
import { useGetTicketsQuery } from '@/api/tickets';
import { TicketTable } from '../ticket-search/components/TicketTable/TicketTable';
import { TicketPagination } from '../ticket-search/components/TicketTable/TicketPagination';
import FullPageSpinner from '@/components/FullPageSpinner/FullPageSpinner';

function TicketPredefinedSearch({ initialFilters }) {
  const [filters, setFilters] = useState(() => ({
    ...initialFilters,
    page: 1,
  }));

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const { data, isSuccess, isLoading } = useGetTicketsQuery(filters);

  const { entities: tickets = [], totalEntities = 0 } = data ?? {};

  const isEmpty = isSuccess && filters.page === 1 && tickets.length === 0;

  return (
    <Box>
      <FullPageSpinner open={isLoading} />
      <Box marginTop="24px">
        <TicketTable tickets={tickets ?? []} isEmpty={isEmpty} />
      </Box>

      {!isEmpty && (
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          marginTop="12px"
        >
          <TicketPagination
            page={filters.page}
            perPage={5}
            totalEntities={totalEntities}
            onPageChange={handlePageChange}
          />
        </Box>
      )}
    </Box>
  );
}

export default TicketPredefinedSearch;
