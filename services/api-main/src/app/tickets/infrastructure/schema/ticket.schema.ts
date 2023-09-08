import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  TicketHistoryItem,
  TicketHistoryItemSchemaType,
} from './ticket-history.schema';
import { UserDb } from 'src/app/users/infrastructure/schema/user.schema';
import mongoose, { Document } from 'mongoose';
import { TicketTagDb } from 'src/app/ticket-tag-system/infrastructure/schema/ticket-tag.schema';

@Schema()
export class TicketDb extends Document {
  constructor() {
    super();
    this.history = [];
  }

  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  createdBy: UserDb;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  assignees: UserDb[];

  @Prop()
  createdAt: Date;

  @Prop()
  title: string;

  @Prop()
  body: string;

  @Prop({ type: String })
  status: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TicketTag' }] })
  tags: TicketTagDb[];

  @Prop({ type: [{ type: TicketHistoryItemSchemaType }] })
  history: TicketHistoryItem[];
}

export const TicketSchema = SchemaFactory.createForClass(TicketDb);

export type TicketDocument = TicketDb & Document;
