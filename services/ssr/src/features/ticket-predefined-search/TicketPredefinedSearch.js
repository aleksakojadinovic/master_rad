import { Box } from '@mui/material';
import React, { useState } from 'react';
import { useGetTicketsQuery } from '@/api/tickets';
import { TicketTable } from '../ticket-search/components/TicketTable/TicketTable';
import { TicketPagination } from '../ticket-search/components/TicketTable/TicketPagination';

function TicketPredefinedSearch({ initialFilters }) {
  const [filters, setFilters] = useState(() => ({
    ...initialFilters,
    page: 1,
  }));

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const {
    data: { entities: tickets, totalEntities },
    isSuccess,
  } = useGetTicketsQuery(filters);

  const isEmpty = isSuccess && filters.page === 1 && tickets.length === 0;

  return (
    <Box>
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
