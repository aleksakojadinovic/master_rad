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

export function TicketTable({ tickets }) {
  const intl = useIntl();
  const theme = useTheme();
  const renderRowHeaderTitle = (title) => (
    <Typography variant="body1">{title}</Typography>
  );

  return (
    <TableContainer component={Paper} sx={{ minHeight: '450px' }}>
      <Table sx={{ width: '100%' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              {renderRowHeaderTitle(
                intl.formatMessage(ticketSearchMessages.titleCreatedBy),
              )}
            </TableCell>
            <TableCell>
              {renderRowHeaderTitle(
                intl.formatMessage(ticketSearchMessages.titleTicketTitle),
              )}
            </TableCell>
            <TableCell align="center">
              {renderRowHeaderTitle(
                intl.formatMessage(ticketSearchMessages.titleStatus),
              )}
            </TableCell>
            <TableCell align="center">
              {renderRowHeaderTitle(
                intl.formatMessage(ticketSearchMessages.titleActions),
              )}
            </TableCell>
            <TableCell align="center">
              {renderRowHeaderTitle(
                intl.formatMessage(ticketSearchMessages.titleAssignees),
              )}
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
