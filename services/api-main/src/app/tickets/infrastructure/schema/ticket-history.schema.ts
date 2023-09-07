/* eslint-disable @typescript-eslint/no-empty-function */
import { TicketHistoryEntryTypeUnion } from '../../types';
import { User } from 'src/app/users/schema/user.schema';
import { TicketHistoryEntryType, TicketStatus } from '../../types';

import { v4 as uuid } from 'uuid';
import mongoose from 'mongoose';

export class TicketHistoryEntryCreated {
  constructor() {}
}

export class TicketHistoryEntryStatusChange {
  constructor(public status: TicketStatus) {}
}

// The initiator field can be used for the user who commented
export class TicketHistoryEntryCommentAdded {
  constructor(
    public body: string,
    public commentId: string,
    public isInternal: boolean = false,
  ) {}
}

export class TicketHistoryEntryDeleted {
  constructor() {}
}

export class TicketHistoryEntryTitleChanged {
  constructor(public title: string) {}
}

export class TicketHistoryEntryBodyChanged {
  constructor(public body: string) {}
}

export class TicketHistoryEntryAssigneesAdded {
  constructor(public assignees: string[]) {}
}

export class TicketHistoryItem {
  constructor(
    public groupId: string,
    public timestamp: Date,
    // I'm not sure whether this can be automatically connected to the mongoose Object id
    public initiator: User,
    public note: string,
    public entryType: TicketHistoryEntryType,
    public entry: TicketHistoryEntryTypeUnion,
  ) {}

  static create({
    groupId,
    timestamp,
    initiator,
    note,
    entry,
  }: {
    groupId?: string;
    timestamp?: Date;
    initiator: User;
    note?: string;
    entry: TicketHistoryEntryTypeUnion;
  }): TicketHistoryItem {
    const resolvedGroupId = groupId ?? uuid();
    const resolvedTimestamp = timestamp ?? new Date();
    const resolvedNote = note ?? '';

    let type: TicketHistoryEntryType;

    if (entry instanceof TicketHistoryEntryCreated) {
      type = TicketHistoryEntryType.CREATED;
    }

    if (entry instanceof TicketHistoryEntryDeleted) {
      type = TicketHistoryEntryType.DELETED;
    }

    if (entry instanceof TicketHistoryEntryStatusChange) {
      type = TicketHistoryEntryType.STATUS_CHANGED;
    }

    if (entry instanceof TicketHistoryEntryCommentAdded) {
      type = TicketHistoryEntryType.COMMEND_ADDED;
    }

    if (entry instanceof TicketHistoryEntryTitleChanged) {
      type = TicketHistoryEntryType.TITLE_CHANGED;
    }

    if (entry instanceof TicketHistoryEntryBodyChanged) {
      type = TicketHistoryEntryType.BODY_CHANGED;
    }

    if (entry instanceof TicketHistoryEntryAssigneesAdded) {
      type = TicketHistoryEntryType.ASSIGNEES_ADDED;
    }

    return new TicketHistoryItem(
      resolvedGroupId,
      resolvedTimestamp,
      initiator,
      resolvedNote,
      type,
      entry,
    );
  }
}

export const TicketHistoryItemSchemaType = {
  timestamp: Date,
  initiator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: String,
  entryType: { type: Number, enum: TicketHistoryEntryType },
  entry: { type: Object },
};
