import { notificationTypeTitlesMessages } from '@/translations/notifications';
import { useIntl } from 'react-intl';

function useNotificationTitle({ type, payload }) {
  const intl = useIntl();
  const translation =
    notificationTypeTitlesMessages[type] ??
    notificationTypeTitlesMessages.defaultNotification;

  return intl.formatMessage(translation, { payload });
}

export default useNotificationTitle;
