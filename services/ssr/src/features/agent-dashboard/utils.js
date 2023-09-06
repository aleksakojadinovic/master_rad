import { TicketStatus } from '@/enums/tickets';

export const getMyOpenParams = (userId) => ({
  page: 1,
  perPage: 5,
  assignee: userId,
  statuses: [TicketStatus.OPEN],
  includes: ['createdBy', 'assignees'],
});

export const getMyInProgressParams = (userId) => ({
  page: 1,
  perPage: 5,
  assignee: userId,
  statuses: [TicketStatus.IN_PROGRESS],
  includes: ['createdBy', 'assignees'],
});

export const getNewTodayParams = () => ({
  page: 1,
  perPage: 5,
  statuses: [TicketStatus.NEW],
  unassigned: true,
  includes: ['createdBy', 'assignees'],
});

export const getPredefinedParams = (userId) => {
  return [
    getMyOpenParams(userId),
    getMyInProgressParams(userId),
    getNewTodayParams(),
  ];
};
