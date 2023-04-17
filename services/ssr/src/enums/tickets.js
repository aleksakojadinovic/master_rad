export const TicketStatus = {
  NEW: '0',
  OPEN: '1',
  CLOSED: '2',
};

export const TicketStatusText = {
  [TicketStatus.NEW]: 'New',
  [TicketStatus.OPEN]: 'Open',
  [TicketStatus.CLOSED]: 'Closed',
};

export const TicketHistoryEntryType = {
  CREATED: '0',
  TITLE_CHANGED: '1',
  BODY_CHANGED: '2',
  STATUS_CHANGED: '3',
  COMMENT_ADDED: '4',
  DELETED: '5',
};
