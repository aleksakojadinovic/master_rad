import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

enum TicketStatus {
  NEW,
  OPEN,
  CLOSED,
}

class TicketHistoryEntryCreated {}

class TicketHistoryEntryStatusChange {
  constructor(public statusFrom: TicketStatus, public statusTo: TicketStatus) {}
}

class TicketHistoryEntryDeleted {}

class TicketHistoryEntry {
  constructor(
    public timestamp: Date,
    public initiator: string,
    public note: string,
    public entry: TicketHistoryEntryStatusChange | TicketHistoryEntryDeleted,
  ) {}
}

@Schema()
export class Ticket {
  constructor(
    userEmail: string,
    title: string,
    body: string,
    status = TicketStatus.NEW,
  ) {
    this.userEmail = userEmail;
    this.title = title;
    this.body = body;
    this.status = status;
    this.history = [];
  }

  @Prop()
  userEmail: string;

  @Prop({ type: String, enum: TicketStatus })
  title: string;

  @Prop()
  body: string;

  @Prop()
  status: TicketStatus;

  @Prop({ type: [{ type: TicketHistoryEntry }] })
  history: TicketHistoryEntryStatusChange[];

  //   @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  //   roles: Role[];
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
