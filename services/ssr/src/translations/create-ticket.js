import { defineMessages } from 'react-intl';

export const createTicketMessages = defineMessages({
  success: {
    id: 'create-ticket.success',
    defaultMessage:
      'Ticket successfully created, you can see it {NewTicketLink}.',
  },
  ticketTitleText: {
    id: 'create-ticket.ticket-title-text',
    defaultMessage: 'Title of your issue',
  },
  ticketDescriptionText: {
    id: 'create-ticket.ticket-description-text',
    defaultMessage: 'Describe your issue in detail',
  },
});
