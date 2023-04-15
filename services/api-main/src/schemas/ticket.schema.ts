import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

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
    public initiator: string,
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
  initiator: mongoose.Schema.Types.ObjectId,
  note: String,
  entryType: { type: String, enum: TicketHistoryEntryType },
  entry: { type: Object },
};

@Schema()
export class Ticket {
  constructor() {
    this.history = [];
  }

  @Prop({ type: String, enum: TicketStatus })
  title: string;

  @Prop()
  body: string;

  @Prop()
  status: TicketStatus;

  @Prop({ type: [{ type: TicketHistoryEntrySchemaType }] })
  history: TicketHistoryEntry[];

  //   @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  //   roles: Role[];
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
