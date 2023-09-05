import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TicketStatusBadge from '../../features/ticket-view/components/TicketStatusBadge';
import { Typography, useTheme } from '@mui/material';
import UserChip from '../User/UserChip';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { globalMessages } from '@/translations/global';

export function TicketTable({ tickets }) {
  const intl = useIntl();
  const theme = useTheme();
  const renderRowHeaderTitle = (title) => (
    <Typography variant="body1">{title}</Typography>
  );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: '100%' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{renderRowHeaderTitle('User')}</TableCell>
            <TableCell>{renderRowHeaderTitle('Title')}</TableCell>
            <TableCell align="center">
              {renderRowHeaderTitle('Status')}
            </TableCell>
            <TableCell align="center">
              {renderRowHeaderTitle('Actions')}
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
                <Link href={`/tickets/view/${ticket.id}`} target="_blank">
                  {intl.formatMessage(globalMessages.open)}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
