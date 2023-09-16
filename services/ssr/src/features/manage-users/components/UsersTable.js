import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Paper,
} from '@mui/material';
import RoleChip from './RoleChip';
import UserStatusChip from './UserStatusChip';
import { useIntl } from 'react-intl';
import { manageUsersMessages } from '@/translations/manage-users';

function UsersTable({ data, onPageChange, onPerPageChange }) {
  const intl = useIntl();
  const { entities, page, perPage, totalEntities } = data;

  const handleChangePage = (_event, newPage) => {
    onPageChange(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    onPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ overflowX: 'scroll' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {intl.formatMessage(manageUsersMessages.fullNameTableHeader)}
              </TableCell>
              <TableCell>
                {intl.formatMessage(manageUsersMessages.roleTableHeader)}
              </TableCell>
              <TableCell>
                {intl.formatMessage(manageUsersMessages.statusTableHeader)}
              </TableCell>
              <TableCell>
                {intl.formatMessage(manageUsersMessages.actionsTableHeader)}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entities.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>
                  <RoleChip role={user.role} />
                </TableCell>
                <TableCell>
                  <UserStatusChip status={user.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalEntities > 0 && (
        <TablePagination
          component="div"
          count={totalEntities}
          page={page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={perPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20, 50]}
        />
      )}
    </Box>
  );
}

export default UsersTable;
