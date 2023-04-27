export enum TicketStatus {
  NEW,
  OPEN,
  CLOSED,
}

export enum TicketHistoryEntryType {
  CREATED,
  TITLE_CHANGED,
  BODY_CHANGED,
  STATUS_CHANGED,
  COMMEND_ADDED,
  DELETED,
}

export enum TicketCategoryType {
  GENERAL_SUPPORT,
  TECH_SUPPORT,
}
