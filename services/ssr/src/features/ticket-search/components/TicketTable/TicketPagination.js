import { Pagination } from '@mui/material';

export function TicketPagination({ page, onPageChange, hasData = true }) {
  return (
    <Pagination
      page={page}
      count={hasData ? page + 1 : page}
      onChange={(_e, newPage) => onPageChange(newPage)}
    />
  );
}
