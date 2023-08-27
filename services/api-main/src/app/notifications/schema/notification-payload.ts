export enum NotificationPayloadType {
  NOTIFICATION_PAYLOAD_TYPE_COMMENT = 'NOTIFICATION_PAYLOAD_TYPE_COMMENT',
  NOTIFICATION_PAYLOAD_TYPE_ASSIGNED = 'NOTIFICATION_PAYLOAD_TYPE_ASSIGNED',
}

export class NotificationPayload {
  constructor(type: NotificationPayloadType, url: string) {
    this.type = type;
    this.url = url;
  }

  type: NotificationPayloadType;
  url: string;
}

export class CommentAddedNotificationPayload extends NotificationPayload {
  constructor(url: string) {
    super(NotificationPayloadType.NOTIFICATION_PAYLOAD_TYPE_COMMENT, url);
  }

  ticketId: string;
  commentId: string;
  commentPreview: string;
}
