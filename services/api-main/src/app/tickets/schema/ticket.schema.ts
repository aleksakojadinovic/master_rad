/* eslint-disable @typescript-eslint/ban-types */
// TODO: Split to multiple files

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  TicketHistoryItem,
  TicketHistoryItemSchemaType,
} from './ticket-history.schema';
import { User } from 'src/app/users/schema/user.schema';
import mongoose, { Document } from 'mongoose';
import { TicketStatus } from '../types';
import { TicketTag } from 'src/app/ticket-tag-system/schema/ticket-tag.schema';

@Schema()
export class Ticket extends Document {
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

export const TicketSchema = SchemaFactory.createForClass(Ticket);
