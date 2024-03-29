import { defineMessages } from 'react-intl';

export const queryStatusMessages = defineMessages({
  success: {
    id: 'query-status.success',
    defaultMessage: 'Success',
  },
  error: {
    id: 'query-status.error',
    defaultMessage: 'An error has occurred',
  },
  updateSuccessfulX: {
    id: 'query-status.update-successful-x',
    defaultMessage: 'Successfuly updated {x}',
  },
  deleteSuccessfulX: {
    id: 'query-status.delete-successful-x',
    defaultMessage: 'Successfuly deleted {x}',
  },
  loading: {
    id: 'query-status.loading',
    defaultMessage: 'Loading...',
  },
});
