import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { TicketHistoryItem } from './ticket-history.schema';
import mongoose, { Document } from 'mongoose';

@Schema({ collection: 'tickets' })
export class TicketDb extends Document {
  _id: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.Mixed }] })
  history: TicketHistoryItem[];

  getMostRecentTitle!: () => string;
}

export const TicketSchema = SchemaFactory.createForClass(TicketDb);

TicketSchema.methods.getMostRecentTitle = function () {
  console.log(this);
  return '';
};

export type TicketDocument = TicketDb & Document;
