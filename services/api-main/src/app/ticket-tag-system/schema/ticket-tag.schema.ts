import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { TicketTagGroup } from './ticket-tag-group.schema';

@Schema()
export class TicketTag {
  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  _id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'TicketTagGroup' })
  group: TicketTagGroup;

  @Prop({ type: String })
  nameIntlKey: string;

  @Prop({ type: String })
  descriptionIntlKey: string;
}

export const TicketTagSchema = SchemaFactory.createForClass(TicketTag);
