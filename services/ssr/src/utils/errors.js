import { apiErrorMessages } from '@/translations/api-errors';

export const resolveErrorMessage = (intl, error) => {
  if (!error || !error.errorType || !apiErrorMessages[error.errorType]) {
    return intl.formatMessage(apiErrorMessages.generic);
  }

  return intl.formatMessage(apiErrorMessages[error.errorType], error.payload);
};
