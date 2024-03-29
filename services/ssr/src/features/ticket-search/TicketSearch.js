import { selectGetTicketsQueryResponse } from '@/api/tickets';
import TicketFilters from '@/features/ticket-search/components/TicketFilters/TicketFilters';
import { TicketPagination } from '@/features/ticket-search/components/TicketTable/TicketPagination';
import { TicketTable } from '@/features/ticket-search/components/TicketTable/TicketTable';
import { getTicketSearchTicketsParams } from '@/utils/params';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export default function TicketSearch({ page, perPage, filters }) {
  const router = useRouter();

  const resolveNewQueryParams = (newPage, newPerPage, newFilters) => {
    const sp = new URLSearchParams();

    Object.entries(newFilters).forEach(([k, v]) => sp.set(k, v));
    sp.set('page', newPage);
    sp.set('perPage', newPerPage);

    router.push(`/tickets/search?${sp.toString()}`);
  };

  const { entities: tickets, totalEntities } = useSelector((state) =>
    selectGetTicketsQueryResponse(
      state,
      getTicketSearchTicketsParams(page, perPage, filters),
    ),
  );

  const handlePageChange = (newPage) => {
    resolveNewQueryParams(newPage, perPage, filters);
  };

  const handlePerPageChange = (newPerPage) => {
    resolveNewQueryParams(page, newPerPage, filters);
  };

  const handleFiltersChange = (newFilters) => {
    resolveNewQueryParams(1, perPage, newFilters);
  };

  return (
    <Box>
      <Box marginBottom="12px">
        <TicketFilters filters={filters} onChange={handleFiltersChange} />
      </Box>

      <Box marginTop="24px">
        <TicketTable tickets={tickets} />
      </Box>

      <Box width="100%" display="flex" justifyContent="center" marginTop="12px">
        <TicketPagination
          page={page}
          perPage={perPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handlePerPageChange}
          hasData={tickets?.length > 0}
          totalEntities={totalEntities}
        />
      </Box>
    </Box>
  );
}
