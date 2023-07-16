import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Role } from './role.schema';
import mongoose from 'mongoose';
import { AutoMap } from '@automapper/classes';

@Schema()
export class User {
  constructor(
    username: string,
    firstName: string,
    lastName: string,
    passwordHash: string,
    roles: Role[],
  ) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.passwordHash = passwordHash;
    this.roles = roles;
  }

  _id: string;

  @Prop()
  @AutoMap()
  username: string;

  @Prop()
  @AutoMap()
  firstName: string;

  @Prop()
  @AutoMap()
  lastName: string;

  @Prop({ type: String, select: false })
  passwordHash: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  @AutoMap(() => Role)
  roles: Role[];

  hasRole!: (role: string) => boolean;
  isAdministrator!: () => boolean;
  isSuperAdministrator!: () => boolean;
  isAgent!: () => boolean;
  isCustomer!: () => boolean;
}

export const UserSchema = SchemaFactory.createForClass<User>(User);

UserSchema.index({ firstName: 'text', lastName: 'text' });

UserSchema.methods.hasRole = function (role: string) {
  return this.roles.map(({ name }) => name).includes(role);
};

UserSchema.methods.isAdministrator = function () {
  return this.hasRole('administrator');
};

UserSchema.methods.isSuperAdministrator = function () {
  return this.hasRole('superadministrator');
};

UserSchema.methods.isAgent = function () {
  return this.hasRole('agent');
};

UserSchema.methods.isCustomer = function () {
  return this.hasRole('customer');
};
