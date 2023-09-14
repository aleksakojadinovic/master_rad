import { NotificationPayloadAssigned } from './notification-payload-assigned';
import { NotificationPayloadCommentAdded } from './notification-payload-comment-added';

export type NotificationPayload =
  | NotificationPayloadCommentAdded
  | NotificationPayloadAssigned;
