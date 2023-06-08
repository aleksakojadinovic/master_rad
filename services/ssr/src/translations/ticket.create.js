import { defineMessages } from 'react-intl';

export const createTicket = defineMessages({
  success: {
    id: 'create-ticket.success',
    defaultMessage:
      'Ticket successfully created, you can see it {NewTicketLink}.',
  },
  ticketTitleText: {
    id: 'create-ticket.ticket-title-text',
    defaultMessage: 'Title of your ticket',
  },
});
