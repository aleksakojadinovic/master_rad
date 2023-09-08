import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { TicketTagGroupDb } from './ticket-tag-group.schema';
import { IntlValue } from 'src/codebase/types/IntlValue';

@Schema()
export class TicketTagDb {
  constructor(nameIntl: IntlValue, descriptionIntl: IntlValue) {
    this.nameIntl = nameIntl;
    this.descriptionIntl = descriptionIntl;
  }

  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'TicketTagGroup' })
  group: TicketTagGroupDb;

  @Prop({ type: Object })
  nameIntl: IntlValue;

  @Prop({ type: Object })
  descriptionIntl: IntlValue;
}

export const TicketTagSchema = SchemaFactory.createForClass(TicketTagDb);

export type TicketTagDocument = TicketTagDb & Document;
