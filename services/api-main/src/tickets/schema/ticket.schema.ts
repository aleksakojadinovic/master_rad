/* eslint-disable @typescript-eslint/ban-types */
// TODO: Split to multiple files

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  TicketHistoryItem,
  TicketHistoryItemSchemaType,
} from './ticket-history.schema';
import { TicketState } from './ticket-state.schema';

@Schema()
export class Ticket {
  constructor() {
    this.history = [];
  }

  _id: string;

  state: TicketState;

  @Prop({ type: [{ type: TicketHistoryItemSchemaType }] })
  history: TicketHistoryItem[];
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
