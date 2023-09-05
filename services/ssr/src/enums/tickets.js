export const TicketStatus = {
  NEW: 'NEW',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  RESOLVED: 'RESOLVED',
  IN_PROGRESS: 'IN_PROGRESS',
};

export const TICKET_STATUSES = [
  TicketStatus.NEW,
  TicketStatus.OPEN,
  TicketStatus.CLOSED,
  TicketStatus.RESOLVED,
  TicketStatus.IN_PROGRESS,
];

export const TicketHistoryEntryType = {
  CREATED: 0,
  TITLE_CHANGED: 1,
  BODY_CHANGED: 2,
  STATUS_CHANGED: 3,
  COMMENT_ADDED: 4,
  DELETED: 5,
};
