import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { TicketTagGroup } from './ticket-tag-group.schema';
import { IntlValue } from 'src/codebase/types/IntlValue';

@Schema()
export class TicketTag {
  constructor(nameIntl: IntlValue, descriptionIntl: IntlValue) {
    this.nameIntl = nameIntl;
    this.descriptionIntl = descriptionIntl;
  }

  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'TicketTagGroup' })
  group: TicketTagGroup;

  @Prop({ type: Object })
  nameIntl: IntlValue;

  @Prop({ type: Object })
  descriptionIntl: IntlValue;
}

export const TicketTagSchema = SchemaFactory.createForClass(TicketTag);

export type TicketTagDocument = TicketTag & Document;
