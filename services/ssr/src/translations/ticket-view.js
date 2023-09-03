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
    id: 'comments.add-comment-placeholder',
    defaultMessage: 'Add a comment.',
  },
  addInternalCommentPlaceholder: {
    id: 'comments.add-internal-placeholder',
    defaultMessage: 'Add an internal comment.',
  },
});
