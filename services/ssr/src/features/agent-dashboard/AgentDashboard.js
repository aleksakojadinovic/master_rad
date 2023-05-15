import { selectGetTicketsQueryResponse } from '@/api/tickets';
import { TicketTable } from '@/components/TicketTable/TicketTable';
import { getAgentDashboardTicketsParams } from '@/utils/params';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

export default function AgentDashboard() {
  const tickets = useSelector((state) =>
    selectGetTicketsQueryResponse(state, getAgentDashboardTicketsParams()),
  );
  return (
    <Box>
      <TicketTable tickets={tickets} />
    </Box>
  );
}
