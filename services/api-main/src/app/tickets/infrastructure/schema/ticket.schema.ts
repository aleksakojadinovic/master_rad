import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  TicketHistoryItem,
  TicketHistoryItemSchemaType,
} from './ticket-history.schema';
import { User } from 'src/app/users/schema/user.schema';
import mongoose, { Document } from 'mongoose';
import { TicketTag } from 'src/app/ticket-tag-system/schema/ticket-tag.schema';
import { TicketStatus } from '../../types';

@Schema()
export class TicketDb extends Document {
  constructor() {
    super();
    this.history = [];
  }

  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  createdBy: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  assignees: User[];

  @Prop()
  createdAt: Date;

  @Prop()
  title: string;

  @Prop()
  body: string;

  @Prop()
  status: TicketStatus;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TicketTag' }] })
  tags: TicketTag[];

  @Prop({ type: [{ type: TicketHistoryItemSchemaType }] })
  history: TicketHistoryItem[];
}

export const TicketSchema = SchemaFactory.createForClass(TicketDb);

export type TicketDocument = TicketDb & Document;
