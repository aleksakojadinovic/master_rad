import { selectGetTicketsQueryResponse } from '@/api/tickets';
import TicketCard from '@/components/TicketCard/TicketCard';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';

export default function AgentDashboard() {
  const tickets = useSelector(selectGetTicketsQueryResponse);
  console.log({ tickets });
  return (
    <Grid container gap={2}>
      {tickets.map((ticket) => (
        <Grid key={ticket.id} item xs={12} md={3}>
          <TicketCard key={ticket.id} ticket={ticket} />
        </Grid>
      ))}
    </Grid>
  );
}
