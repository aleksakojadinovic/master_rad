// TODO: Split to multiple files

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';
import { uuid } from 'uuidv4';
import { time, timeStamp } from 'console';

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

type EntryType =
  | TicketHistoryEntryCreated
  | TicketHistoryEntryDeleted
  | TicketHistoryEntryStatusChange
  | TicketHistoryEntryCommentAdded
  | TicketHistoryEntryTitleChanged
  | TicketHistoryEntryBodyChanged;

export class TicketHistoryItem {
  constructor(
    public groupId: string,
    public timestamp: Date,
    // I'm not sure whether this can be automatically connected to the mongoose Object id
    public initiator: User,
    public note: string,
    public entryType: TicketHistoryEntryType,
    public entry: EntryType,
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
    entry: EntryType;
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

@Schema()
export class Ticket {
  constructor() {
    this.history = [];
  }

  _id: string;

  @Prop({ type: [{ type: TicketHistoryItemSchemaType }] })
  history: TicketHistoryItem[];
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
