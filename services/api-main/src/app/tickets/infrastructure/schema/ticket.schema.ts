import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { TicketHistoryItem } from './ticket-history.schema';
import mongoose, { Document } from 'mongoose';
import { TicketStatus } from '../../domain/value-objects/ticket-status';
import { UserDb } from 'src/app/users/infrastructure/schema/user.schema';
import { TicketTagDb } from 'src/app/ticket-tag-system/infrastructure/schema/ticket-tag.schema';

@Schema({ collection: 'tickets' })
export class TicketDb extends Document {
  _id: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  body: string;

  @Prop({ type: String })
  status: TicketStatus;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDb' }] })
  assignees: UserDb[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserDb' })
  createdBy: UserDb;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TicketTagDb' }],
  })
  tags: TicketTagDb[];

  @Prop({ type: [{ type: mongoose.Schema.Types.Mixed }] })
  history: TicketHistoryItem[];

  getMostRecentTitle!: () => string;
}

export const TicketSchema = SchemaFactory.createForClass(TicketDb);

export type TicketDocument = TicketDb & Document;
