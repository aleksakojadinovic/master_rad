import CommentAddedNotificationPayload from './components/payloads/CommentAddedNotificationPayload';
import { NOTIFICATION_TYPES } from './constants';

function NotificationPayload({ notification }) {
  switch (notification.type) {
    case NOTIFICATION_TYPES.COMMENT_ADDED:
      return <CommentAddedNotificationPayload notification={notification} />;
    default:
      return null;
  }
}

export default NotificationPayload;
