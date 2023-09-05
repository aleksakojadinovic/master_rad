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

  const { data: tickets } = useGetTicketsQuery(filters);

  return (
    <Box>
      <Box marginTop="24px">
        <TicketTable tickets={tickets ?? []} />
      </Box>

      <Box width="100%" display="flex" justifyContent="center" marginTop="12px">
        <TicketPagination
          page={filters.page}
          onPageChange={handlePageChange}
          hasData={tickets?.length > 0}
        />
      </Box>
    </Box>
  );
}

export default TicketPredefinedSearch;
