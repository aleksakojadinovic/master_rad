import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import UserChip from '../User/UserChip';
import TicketStatusBadge from '../../features/ticket-view/components/TicketStatusBadge';
import Link from 'next/link';

export default function TicketCard({ ticket }) {
  return (
    <Link
      href={`/tickets/view/${ticket.id}`}
      style={{ textDecoration: 'none' }}
    >
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <Typography component="body1">{ticket.title}</Typography>
        </CardContent>
        <Divider />
        <CardContent>
          <Typography component="body2">By </Typography>
          <UserChip user={ticket.createdBy} />
          <Box sx={{ marginTop: '8px' }}>
            <TicketStatusBadge status={ticket.status} />
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
}
