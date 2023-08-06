import { defineMessages } from 'react-intl';

export const notificationTypeTitlesMessages = defineMessages({
  CommentAddedNotification: {
    id: 'notifications-titles.comment-added-notification',
    defaultMessage: 'New comment',
  },
  defaultNotification: {
    id: 'notifications-titles.default',
    defaultMessage: 'A notification',
  },
});

export const notificationTypePayloadMessages = defineMessages({
  CommentAddedNotification: {
    id: 'notifications-payloads.comment-added-notification.ticket',
    defaultMessage: '{ticketTitle}',
  },
});
