import { globalMessages } from '@/translations/global';
import { TablePagination } from '@mui/material';
import { useIntl } from 'react-intl';

export function TicketPagination({
  totalEntities,
  page,
  perPage,
  onPageChange,
  onRowsPerPageChange = {},
}) {
  const intl = useIntl();
  return (
    totalEntities > 0 && (
      <TablePagination
        component="div"
        count={totalEntities}
        page={page - 1}
        onPageChange={(_e, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={perPage}
        onRowsPerPageChange={(e) => onRowsPerPageChange(e.target.value)}
        rowsPerPageOptions={[5, 10, 20, 50]}
        labelRowsPerPage={intl.formatMessage(globalMessages.rowsPerPage)}
      />
    )
  );
}
