import { TicketStatus } from '@/enums/tickets';

export const myActiveParams = (userId) => ({
  page: 1,
  perPage: 5,
  assignee: userId,
  status: `-${TicketStatus.CLOSED.toString()}`,
  includes: ['createdBy', 'assignees'],
});
