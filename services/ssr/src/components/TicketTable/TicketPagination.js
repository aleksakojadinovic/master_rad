import { Pagination } from '@mui/material';

export function TicketPagination({ page, perPage, onPageChange }) {
  return (
    <Pagination
      page={page}
      count={10}
      onChange={(_e, newPage) => onPageChange(newPage)}
    />
  );
}
