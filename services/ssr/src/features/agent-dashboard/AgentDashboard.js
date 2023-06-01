import { selectGetTicketsQueryResponse } from '@/api/tickets';
import SelectPerPage from '@/components/SelectPerPage/SelectPerPage';
import TicketFilters from '@/components/TicketFilters/TicketFilters';
import { TicketPagination } from '@/components/TicketTable/TicketPagination';
import { TicketTable } from '@/components/TicketTable/TicketTable';
import { getAgentDashboardTicketsParams } from '@/utils/params';
import { Box, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export default function AgentDashboard({ page, perPage, filters }) {
  const router = useRouter();

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

  const handlePageChange = (newPage) => {
    resolveNewQueryParams(newPage, perPage, filters);
  };

  const handlePerPageChange = (newPerPage) => {
    resolveNewQueryParams(page, newPerPage, filters);
  };

  const handleFiltersChange = (newFilters) => {
    resolveNewQueryParams(page, perPage, newFilters);
  };

  return (
    <Box>
      <Box marginBottom="12px">
        <TicketFilters filters={filters} onChange={handleFiltersChange} />
      </Box>

      <TicketTable tickets={tickets} />
      <Box width="100%" display="flex" justifyContent="center" marginTop="12px">
        <Grid container>
          <Grid item xs={6}>
            <TicketPagination page={page} onPageChange={handlePageChange} />
          </Grid>
          <Grid item xs={6}>
            <SelectPerPage value={perPage} onChange={handlePerPageChange} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
