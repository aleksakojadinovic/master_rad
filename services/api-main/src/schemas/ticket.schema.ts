import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

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
  constructor(public statusFrom: TicketStatus, public statusTo: TicketStatus) {}
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

export class TicketHistoryEntry {
  constructor(
    public timestamp: Date,
    // I'm not sure whether this can be automatically connected to the mongoose Object id
    public initiator: User,
    public note: string,
    public entryType: TicketHistoryEntryType,
    public entry:
      | TicketHistoryEntryCreated
      | TicketHistoryEntryDeleted
      | TicketHistoryEntryStatusChange
      | TicketHistoryEntryCommentAdded
      | TicketHistoryEntryTitleChanged
      | TicketHistoryEntryBodyChanged,
  ) {}
}

export const TicketHistoryEntrySchemaType = {
  timestamp: Date,
  initiator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: String,
  entryType: { type: String, enum: TicketHistoryEntryType },
  entry: { type: Object },
};

@Schema()
export class Ticket {
  constructor() {
    this.history = [];
  }

  _id: string;

  @Prop({ type: [{ type: TicketHistoryEntrySchemaType }] })
  history: TicketHistoryEntry[];
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
