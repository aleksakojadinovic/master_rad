import { TicketStatus } from '@/enums/tickets';
import { defineMessages } from 'react-intl';

export const ticketStatusMessages = defineMessages({
  open: {
    id: 'ticket-status.open',
    defaultMessage: 'Open',
  },
  closed: {
    id: 'ticket-status.closed',
    defaultMessage: 'Closed',
  },
  new: {
    id: 'ticket-status.new',
    defaultMessage: 'New',
  },
  changeStatus: {
    id: 'ticket-staus.change-status',
    defaultMessage: 'Change status',
  },
  moveTo: {
    id: 'ticket-stauts.move-to-status',
    defaultMessage: 'Move to {status}',
  },
  notAllowedNote: {
    id: 'ticket-status.not-allowed-note',
    defaultMessage: 'This is only allowed to {roles}',
  },
  [TicketStatus.NEW]: {
    id: 'ticket-status.new',
    defaultMessage: 'New',
  },
  [TicketStatus.OPEN]: {
    id: 'ticket-status.open',
    defaultMessage: 'Open',
  },
  [TicketStatus.IN_PROGRESS]: {
    id: 'ticket-status.in-progress',
    defaultMessage: 'In progress',
  },
  [TicketStatus.RESOLVED]: {
    id: 'ticket-status.in-resolved',
    defaultMessage: 'Resolved',
  },
  [TicketStatus.CLOSED]: {
    id: 'ticket-status.closed',
    defaultMessage: 'Closed',
  },
});
