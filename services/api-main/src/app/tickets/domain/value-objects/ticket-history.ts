// export enum TicketHistoryEntryType {
//   CREATED = 'CREATED',
//   TITLE_CHANGED = 'TITLE_CHANGED',
//   BODY_CHANGED = 'BODY_CHANGED',
//   COMMENT_ADDED = 'COMMENT_ADDED',
//   ASSIGNEES_ADDED = 'ASSIGNEES_ADDED',

import { TicketStatus } from './ticket-status';

// }
export class CreatedPayload {
  // TODO: user ddd
  user: any;
}
export class CommentAddedPayload {
  commentId: string;
  body: string;
}
export class AssigneeAddedPayload {
  // TODO: user ddd
  user: any;
}
export class StatusChangedPayload {
  status: TicketStatus;
}

export type TicketHistoryPayload =
  | CreatedPayload
  | CommentAddedPayload
  | AssigneeAddedPayload
  | StatusChangedPayload;

export class TicketHistoryEntry {
  timestamp: Date;
  // TODO: user ddd
  user: any;
  payload: TicketHistoryEntry;
}
