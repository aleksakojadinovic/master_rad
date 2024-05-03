import { apiErrorMessages } from '@/translations/api-errors';

export const resolveErrorMessage = (intl, error) => {
  console.log(error);
  if (error && error.type && error.type === 'ValidationError') {
    return intl.formatMessage(apiErrorMessages.genericValidationError);
  }

  if (!error || !error.errorType || !apiErrorMessages[error.errorType]) {
    return intl.formatMessage(apiErrorMessages.generic);
  }

  return intl.formatMessage(apiErrorMessages[error.errorType], error.payload);
};
