import { selectGetTicketsQueryResponse } from '@/api/tickets';
import { TicketFilters } from '@/components/TicketFilters/TicketFilters';
import { TicketPagination } from '@/components/TicketTable/TicketPagination';
import { TicketTable } from '@/components/TicketTable/TicketTable';
import { getAgentDashboardTicketsParams } from '@/utils/params';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export default function AgentDashboard({ page, perPage, filters }) {
  const router = useRouter();

  const handleFiltersChange = (newFilters) => {};

  const resolveNewQueryParams = (newPage, newPerPage, newFilters) => {
    const sp = new URLSearchParams();

    Object.entries(newFilters).forEach(([k, v]) => sp.set(k, v));
    sp.set('page', newPage);
    sp.set('perPage', newPerPage);

    router.push(`/dashboard?${sp.toString()}`);
  };

  const tickets = useSelector((state) =>
    selectGetTicketsQueryResponse(
      state,
      getAgentDashboardTicketsParams(page, perPage, filters),
    ),
  );

  const onPageChange = (newPage) => {
    resolveNewQueryParams(newPage, perPage, filters);
  };

  return (
    <Box>
      <TicketFilters onFiltersChange={handleFiltersChange} />
      <TicketTable tickets={tickets} />
      <Box width="100%" display="flex" justifyContent="center" marginTop="12px">
        <TicketPagination onPageChange={onPageChange} />
      </Box>
    </Box>
  );
}
