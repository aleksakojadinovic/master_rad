import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

enum TicketStatus {
  NEW,
  OPEN,
  CLOSED,
}

export class TicketHistoryEntryCreated {}

export class TicketHistoryEntryStatusChange {
  constructor(public statusFrom: TicketStatus, public statusTo: TicketStatus) {}
}

// The initiator field can be used for the user who commented
export class TicketHistoryEntryCommentAdded {
  constructor(public body: string) {}
}

export class TicketHistoryEntryDeleted {}

export class TicketHistoryEntry {
  constructor(
    public timestamp: Date,
    // I'm not sure whether this can be automatically connected to the mongoose Object id
    public initiator: string,
    public note: string,
    public entry:
      | TicketHistoryEntryCreated
      | TicketHistoryEntryDeleted
      | TicketHistoryEntryStatusChange
      | TicketHistoryEntryCommentAdded,
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
  history: TicketHistoryEntry[];

  //   @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  //   roles: Role[];
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
