import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { TicketHistoryItem } from './ticket-history.schema';
import mongoose, { Document } from 'mongoose';

@Schema()
export class TicketDb extends Document {
  _id: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.Mixed }] })
  history: TicketHistoryItem[];
}

export const TicketSchema = SchemaFactory.createForClass(TicketDb);

export type TicketDocument = TicketDb & Document;
