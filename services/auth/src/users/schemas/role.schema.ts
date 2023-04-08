import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Role {
  constructor(name: string) {
    this.name = name;
  }
  @Prop()
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
