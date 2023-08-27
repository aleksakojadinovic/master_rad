import AssignedNotificationPayload from './components/payloads/AssignedNotificationPayload';
import CommentAddedNotificationPayload from './components/payloads/CommentAddedNotificationPayload';
import { NOTIFICATION_TYPES } from './constants';

function NotificationPayload({ notification }) {
  switch (notification.type) {
    case NOTIFICATION_TYPES.COMMENT_ADDED:
      return <CommentAddedNotificationPayload notification={notification} />;
    case NOTIFICATION_TYPES.ASSIGNED:
      return <AssignedNotificationPayload notification={notification} />;
    default:
      return null;
  }
}

export default NotificationPayload;
