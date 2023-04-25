import { TicketStatus } from '../types';

export class TicketHistoryEntryCreated {
  constructor(public title: string, public body: string) {}
}

export class TicketHistoryEntryStatusChange {
  constructor(public status: TicketStatus) {}
}

// The initiator field can be used for the user who commented
export class TicketHistoryEntryCommentAdded {
  constructor(public body: string) {}
}

export class TicketHistoryEntryDeleted {}

export class TicketHistoryEntryTitleChanged {
  constructor(public title: string) {}
}

export class TicketHistoryEntryBodyChanged {
  constructor(public body: string) {}
}

export type TicketHistoryEntryTypeUnion =
  | TicketHistoryEntryCreated
  | TicketHistoryEntryDeleted
  | TicketHistoryEntryStatusChange
  | TicketHistoryEntryCommentAdded
  | TicketHistoryEntryTitleChanged
  | TicketHistoryEntryBodyChanged;
