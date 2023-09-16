import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from '@mui/material';
import RoleChip from './RoleChip';
import UserStatusChip from './UserStatusChip';

function UsersTable({ data, onPageChange, onPerPageChange }) {
  const { entities, page, perPage, totalEntities } = data;

  const handleChangePage = (_event, newPage) => {
    onPageChange(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    onPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <Paper style={{ overflowX: 'auto' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
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
      <TablePagination
        component="div"
        count={totalEntities}
        page={page - 1}
        onPageChange={handleChangePage}
        rowsPerPage={perPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20, 50]}
      />
    </Paper>
  );
}

export default UsersTable;
