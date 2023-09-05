import { Pagination } from '@mui/material';

export function TicketPagination({ page, onPageChange }) {
  return (
    <Pagination
      page={page}
      count={10000}
      onChange={(_e, newPage) => onPageChange(newPage)}
    />
  );
}
