import { notificationTypeMessages } from '@/translations/notifications';
import { useIntl } from 'react-intl';

function useNotificationTitle({ type, payload }) {
  const intl = useIntl();
  const translation =
    notificationTypeMessages[type] ??
    notificationTypeMessages.defaultNotification;

  return intl.formatMessage(translation, { payload });
}

export default useNotificationTitle;
