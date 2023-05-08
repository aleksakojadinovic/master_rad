import {
  TicketHistoryEntryBodyChanged,
  TicketHistoryEntryCommentAdded,
  TicketHistoryEntryCreated,
  TicketHistoryEntryDeleted,
  TicketHistoryEntryStatusChange,
  TicketHistoryEntryTitleChanged,
} from './schema/ticket-history.schema';

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
  ASSIGNEES_ADDED,
}

export enum TicketCategoryType {
  GENERAL_SUPPORT,
  TECH_SUPPORT,
}

export type TicketHistoryEntryTypeUnion =
  | TicketHistoryEntryCreated
  | TicketHistoryEntryDeleted
  | TicketHistoryEntryStatusChange
  | TicketHistoryEntryBodyChanged
  | TicketHistoryEntryTitleChanged
  | TicketHistoryEntryCommentAdded;
