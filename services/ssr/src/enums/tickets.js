export const TicketStatus = {
  NEW: 'NEW',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  RESOLVED: 'RESOLVED',
  IN_PROGRESS: 'IN_PROGRESS',
};

export const TicketStatusText = {
  [TicketStatus.NEW]: 'New',
  [TicketStatus.OPEN]: 'Open',
  [TicketStatus.CLOSED]: 'Closed',
};

export const TicketHistoryEntryType = {
  CREATED: 0,
  TITLE_CHANGED: 1,
  BODY_CHANGED: 2,
  STATUS_CHANGED: 3,
  COMMENT_ADDED: 4,
  DELETED: 5,
};
