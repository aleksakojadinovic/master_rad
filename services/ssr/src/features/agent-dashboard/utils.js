import { TicketStatus } from '@/enums/tickets';

export const getMyOpenParams = (userId) => ({
  page: 1,
  perPage: 5,
  assignee: userId,
  status: TicketStatus.OPEN,
});

export const getMyInProgressParams = (userId) => ({
  page: 1,
  perPage: 5,
  assignee: userId,
  status: TicketStatus.IN_PROGRESS,
});

export const getNewTodayParams = () => ({ page: 1, perPage: 5 });

export const getPredefinedParams = (userId) => {
  return [
    getMyOpenParams(userId),
    getMyInProgressParams(open),
    getNewTodayParams(),
  ];
};
