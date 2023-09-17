import mongoose from 'mongoose';

export enum TicketHistoryEntryType {
  CREATED = 'CREATED',
  TITLE_CHANGED = 'TITLE_CHANGED',
  BODY_CHANGED = 'BODY_CHANGED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  COMMENT_ADDED = 'COMMEND_ADDED',
  COMMENT_CHANGED = 'COMMENT_CHANGED',
  COMMENT_DELETED = 'COMMENT_DELETED',
  ASSIGNEES_CHANGED = 'ASSIGNEES_CHANGED',
  TAGS_CHANGED = 'TAGS_CHANGED',
}

import { TicketStatus } from '../../domain/value-objects/ticket-status';
import { UserDb } from 'src/app/users/infrastructure/schema/user.schema';
import { TicketTagDb } from 'src/app/ticket-tag-system/infrastructure/schema/ticket-tag.schema';

export class TicketHistoryEntryCreated {
  constructor(
    public title: string,
    public body: string,
    public status: TicketStatus,
  ) {}
}
export class TicketHistoryEntryStatusChanged {
  constructor(public status: TicketStatus) {}
}

export class TicketHistoryEntryCommentAdded {
  constructor(
    public body: string,
    public commentId: string,
    public isInternal: boolean = false,
  ) {}
}

export class TicketHistoryEntryTitleChanged {
  constructor(public title: string) {}
}

export class TicketHistoryEntryBodyChanged {
  constructor(public body: string) {}
}

export class TicketHistoryEntryAssigneesChanged {
  constructor(public assignees: UserDb[]) {}
}

export class TicketHistoryEntryTagsChanged {
  constructor(public tags: TicketTagDb[]) {}
}

export class TicketHistoryEntryCommentChanged {
  constructor(public commentId: string, public body: string) {}
}

export class TicketHistoryEntryCommentDeleted {
  constructor(public commentId: string) {}
}

export class TicketHistoryItem {
  timestamp: Date;
  initiator: UserDb;
  type: TicketHistoryEntryType;
  payload:
    | TicketHistoryEntryCreated
    | TicketHistoryEntryStatusChanged
    | TicketHistoryEntryCommentAdded
    | TicketHistoryEntryTitleChanged
    | TicketHistoryEntryBodyChanged
    | TicketHistoryEntryAssigneesChanged
    | TicketHistoryEntryTagsChanged
    | TicketHistoryEntryCommentChanged
    | TicketHistoryEntryCommentDeleted;
}

export const TicketHistoryItemSchemaType = {
  timestamp: Date,
  initiator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: String,
  entryType: { type: Number, enum: TicketHistoryEntryType },
  entry: { type: Object },
};
