import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AutoMap } from '@automapper/classes';

@Schema()
export class Role {
  constructor(name: string) {
    this.name = name;
  }

  @AutoMap()
  _id: string;

  @AutoMap()
  @Prop()
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
