import { TicketStatus } from '@/enums/tickets';

export const myActiveParams = (userId) => ({
  page: 1,
  perPage: 5,
  createdBy: userId,
  notStatuses: [TicketStatus.CLOSED, TicketStatus.RESOLVED],
  includes: ['createdBy', 'assignees'],
});
