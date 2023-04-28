/* eslint-disable @typescript-eslint/ban-types */
// TODO: Split to multiple files

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  TicketHistoryItem,
  TicketHistoryItemSchemaType,
} from './ticket-history.schema';

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
