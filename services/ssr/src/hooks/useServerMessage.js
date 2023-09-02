import { resolveErrorMessage } from '@/utils/errors';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

function useServerMessage({ successMessage, isSuccess, isError, error }) {
  const intl = useIntl();

  const severity = useMemo(() => {
    if (isSuccess) {
      return 'success';
    }
    if (isError) {
      return 'error';
    }
  }, [isError, isSuccess]);

  const errorMessage = useMemo(() => {
    if (!isError) {
      return null;
    }
    return resolveErrorMessage(intl, error?.data ?? null);
  }, [isError, error, intl]);

  const message = isSuccess ? successMessage : errorMessage;

  return { severity, successMessage, errorMessage, message };
}

export default useServerMessage;
