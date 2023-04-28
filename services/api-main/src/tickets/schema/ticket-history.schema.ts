import { User } from 'src/users/schema/user.schema';
import { TicketHistoryEntryType, TicketStatus } from '../types';

import { v4 as uuid } from 'uuid';
import mongoose from 'mongoose';
import { TicketHistoryItemDTO } from '../dto/ticket-history.dto';

export class TicketHistoryEntry {
  getDTO() {
    return Object.fromEntries(
      Object.getOwnPropertyNames(this).map((k) => [k, this[k]]),
    );
  }
}
export class TicketHistoryEntryCreated extends TicketHistoryEntry {
  constructor(public title: string, public body: string) {
    super();
  }
}

export class TicketHistoryEntryStatusChange extends TicketHistoryEntry {
  constructor(public status: TicketStatus) {
    super();
  }
}

// The initiator field can be used for the user who commented
export class TicketHistoryEntryCommentAdded extends TicketHistoryEntry {
  constructor(public body: string) {
    super();
  }
}

export class TicketHistoryEntryDeleted extends TicketHistoryEntry {
  constructor() {
    super();
  }
}

export class TicketHistoryEntryTitleChanged extends TicketHistoryEntry {
  constructor(public title: string) {
    super();
  }
}

export class TicketHistoryEntryBodyChanged extends TicketHistoryEntry {
  constructor(public body: string) {
    super();
  }
}

export class TicketHistoryItem {
  constructor(
    public groupId: string,
    public timestamp: Date,
    // I'm not sure whether this can be automatically connected to the mongoose Object id
    public initiator: User,
    public note: string,
    public entryType: TicketHistoryEntryType,
    public entry: TicketHistoryEntry,
  ) {}

  getDTO() {
    return new TicketHistoryItemDTO(
      null,
      this.timestamp,
      this.entryType,
      this.entry.getDTO(),
    );
  }

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
    entry: TicketHistoryEntry;
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
