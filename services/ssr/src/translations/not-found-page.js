import { defineMessages } from 'react-intl';

export const notFoundMessages = defineMessages({
  header: {
    id: 'not-found.header',
    defaultMessage: '404 Not found',
  },
  description: {
    id: 'not-found.description',
    defaultMessage:
      'This page either does not exist, or you do not have access to it. Please verify that the URL you are trying to use is correct. If you believe this to be a mistake on our end, please contact us at support@example.com',
  },
});
