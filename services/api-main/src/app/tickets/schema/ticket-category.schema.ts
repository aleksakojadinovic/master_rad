import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { TicketCategoryType } from '../types';

@Schema()
export class TicketCategory {
  constructor(type: TicketCategoryType) {
    this.type = type;
  }

  _id: string;

  @Prop()
  type: TicketCategoryType;
}

export const TicketCategorySchema =
  SchemaFactory.createForClass(TicketCategory);
