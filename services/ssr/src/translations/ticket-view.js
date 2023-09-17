import { defineMessages } from 'react-intl';

export const ticketViewMessages = defineMessages({
  cannotCommentOnThisTicket: {
    id: 'ticket-view.cannot-comment',
    defaultMessage: 'You cannot comment on this ticket',
  },
  publicCommentButtonText: {
    id: 'ticket-view.public-comment-button-text',
    defaultMessage: 'Public',
  },
  internalCommentButtonText: {
    id: 'ticket-view.internal-comment-button-text',
    defaultMessage: 'Internal',
  },
  addPublicCommentPlaceholder: {
    id: 'ticket-view.add-comment-placeholder',
    defaultMessage: 'Add a comment.',
  },
  addInternalCommentPlaceholder: {
    id: 'ticket-view.add-internal-placeholder',
    defaultMessage: 'Add an internal comment.',
  },
  internalCommentNote: {
    id: 'ticket-view.internal-comment-note',
    defaultMessage: 'This is an internal comment, not visible to customer',
  },
  internalLabel: {
    id: 'ticket-view.internal-label',
    defaultMessage: 'INTERNAL',
  },
  goToTop: {
    id: 'ticket-view.go-to-top',
    defaultMessage: 'Go to top',
  },
  goToBottom: {
    id: 'ticket-view.go-to-bottom',
    defaultMessage: 'Go to bottom',
  },
  ticketAssigneesCustomerNote: {
    id: 'ticket-view.ticket-assignees-customer-note:',
    defaultMessage:
      'Your ticket {count, plural, =0 {is not assigned to anyone right now.} other {is assigned to:}}',
  },
  hasAssigned: {
    id: 'ticket-view.has-assigned',
    defaultMessage: 'assigned',
  },
  hasUnassigned: {
    id: 'ticket-view.has-unassigned',
    defaultMessage: 'unassigned',
  },
  dateOn: {
    id: 'ticket-view.date-on',
    defaultMessage: 'on',
  },
  movedFrom: {
    id: 'ticket-view.status-moved-from',
    defaultMessage: 'moved this from',
  },
  movedTo: {
    id: 'ticket-view.status-moved-to',
    defaultMessage: 'to',
  },
  movedOn: {
    id: 'ticket-view.status-moved-on',
    defaultMessage: 'on',
  },
  areYouSureDeleteCommentTitle: {
    id: 'ticket-view.are-you-sure-delete-comment',
    defaultMessage: 'Are you sure you want to delete this comment?',
  },
  areYouSureDeleteCommentBody: {
    id: 'ticket-view.are-you-sure-delete-comment',
    defaultMessage: 'This cannot be undone. Admins may still see this comment.',
  },
  editedAtX: {
    id: 'ticket-view.edited-at-x',
    defaultMessage: 'Edited at {x}',
  },
});
