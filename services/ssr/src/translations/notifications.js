import { defineMessages } from 'react-intl';

export const notificationTypeTitlesMessages = defineMessages({
  CommentAddedNotification: {
    id: 'notifications-titles.comment-added-notification',
    defaultMessage: 'New comment',
  },
  AssignedNotification: {
    id: 'notifications-titles.assigned-notification',
    defaultMessage: 'Assigned to you',
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
  AssignedNotification: {
    id: 'notification-payloads.assigned-notification',
    defaultMessage: 'You have been assigned to ',
  },
});

export const notificationsMessages = defineMessages({
  previewNotAvailable: {
    id: 'notifications.preview-not-available',
    defaultMessage: 'Preview not available',
  },
  noNotifications: {
    id: 'notifications.no-notifications',
    defaultMessage: 'No notifications found.',
  },
});

export const notificationActions = defineMessages({
  openTicket: {
    id: 'notifications.action-open-ticket',
    defaultMessage: 'Open ticket',
  },
  markAsRead: {
    id: 'notifications.actions-mark-read',
    defaultMessage: 'Mark as read',
  },
});
