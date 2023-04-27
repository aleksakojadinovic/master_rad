import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { RoleDTO } from '../dto/role.dto';

@Schema()
export class Role {
  constructor(name: string) {
    this.name = name;
  }
  _id: string;

  @Prop()
  name: string;

  getDTO!: () => RoleDTO;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.methods.getDTO = function () {
  return new RoleDTO(this.id, this.name);
};
