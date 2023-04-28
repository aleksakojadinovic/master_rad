import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { RoleDTO } from '../dto/role.dto';
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

  getDTO!: () => RoleDTO;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
