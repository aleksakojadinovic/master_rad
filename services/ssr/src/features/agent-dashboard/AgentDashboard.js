import { selectGetTicketsQueryResponse } from '@/api/tickets';
import TicketCard from '@/components/TicketCard/TicketCard';
import TicketTableRow from '@/components/TicketTableRow/TicketTableRow';
import { getAgentDashboardTicketsParams } from '@/utils/params';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';

export default function AgentDashboard() {
  const tickets = useSelector((state) =>
    selectGetTicketsQueryResponse(state, getAgentDashboardTicketsParams()),
  );
  return (
    <Grid container gap={2}>
      {tickets.map((ticket) => (
        <TicketTableRow key={ticket.id} ticket={ticket} />
      ))}
    </Grid>
  );
}
