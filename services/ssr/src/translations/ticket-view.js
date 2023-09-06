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
    defaultMessage: 'Your ticket is assigned to',
  },
});
