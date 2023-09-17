import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TicketStatusBadge from '../../../ticket-view/components/TicketStatusBadge';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import UserChip from '../../../../components/User/UserChip';
import { useIntl } from 'react-intl';
import { ticketSearchMessages } from '@/translations/ticket-search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import TableRowsIcon from '@mui/icons-material/TableRows';
import { agentDashboardMessages } from '@/translations/agent-dashboard';
import { formatDate } from '@/utils';

export function TicketTable({ tickets, isEmpty = false }) {
  const intl = useIntl();
  const theme = useTheme();

  if (isEmpty) {
    return (
      <Paper
        sx={{
          minHeight: '450px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TableRowsIcon />
        <Typography variant="body1">
          {intl.formatMessage(agentDashboardMessages.emptyState)}
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ minHeight: '450px' }}>
      <Table sx={{ width: '100%' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="body1">
                {intl.formatMessage(ticketSearchMessages.titleCreatedBy)}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                {intl.formatMessage(ticketSearchMessages.titleTicketTitle)}
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="body1">
                {intl.formatMessage(ticketSearchMessages.titleStatus)}
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="body1">
                {intl.formatMessage(ticketSearchMessages.titleActions)}
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="body1">
                {intl.formatMessage(ticketSearchMessages.titleAssignees)}
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="body1">
                {intl.formatMessage(ticketSearchMessages.titleDate)}
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.id}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                height: '52px !important',
                '&:hover': { backgroundColor: theme.palette.grey[200] },
              }}
            >
              <TableCell>
                <UserChip user={ticket.createdBy} />
              </TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell align="center">
                <TicketStatusBadge status={ticket.status} />
              </TableCell>
              <TableCell align="center">
                <IconButton href={`/tickets/view/${ticket.id}`} target="_blank">
                  <OpenInNewIcon color="primary" />
                </IconButton>
              </TableCell>
              <TableCell align="center">
                {ticket.assignees.map((user) => (
                  <Box key={user.id} marginBottom="3px">
                    <UserChip user={user} />
                  </Box>
                ))}
              </TableCell>
              <TableCell align="center">
                <Typography variant="body1">
                  {formatDate(ticket.createdAt, intl)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
