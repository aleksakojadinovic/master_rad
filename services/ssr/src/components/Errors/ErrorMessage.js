import { resolveErrorMessage } from '@/utils/errors';
import { useIntl } from 'react-intl';

function ErrorMessage({ error }) {
  const intl = useIntl();
  return resolveErrorMessage(intl, error);
}

export default ErrorMessage;
