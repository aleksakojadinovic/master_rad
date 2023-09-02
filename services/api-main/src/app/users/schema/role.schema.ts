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

export const ROLE_SUPERADMINISTRATOR = 'superadministrator';
export const ROLE_ADMINISTRATOR = 'administrator';
export const ROLE_AGENT = 'agent';
export const ROLE_CUSTOMER = 'customer';

export const ROLE = {
  [ROLE_SUPERADMINISTRATOR]: ROLE_SUPERADMINISTRATOR,
  [ROLE_ADMINISTRATOR]: ROLE_ADMINISTRATOR,
  [ROLE_AGENT]: ROLE_AGENT,
  [ROLE_CUSTOMER]: ROLE_CUSTOMER,
};
