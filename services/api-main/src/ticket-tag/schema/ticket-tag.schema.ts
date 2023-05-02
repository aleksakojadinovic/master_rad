import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

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
}

export const RoleSchema = SchemaFactory.createForClass(TicketTag);
