import { defineMessages } from 'react-intl';

export const authModalMessages = defineMessages({
  loginButtonCTA: {
    id: 'auth=modal.login-button-cta',
    defaultMessage: 'Login',
  },
  loginButtonLoadingCTA: {
    id: 'auth-modal.login-button-loading-cta',
    defaultMessage: 'Logging in...',
  },
  modalTitle: {
    id: 'auth-modal.modal-title',
    defaultMessage: 'Log in',
  },
  loginDetails: {
    id: 'auth-modal.login-details',
    defaultMessage:
      'Please login. If you are a new customer, please contact us at support@example.com about setting up your account',
  },
});
