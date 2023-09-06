import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AutoMap } from '@automapper/classes';
import { Role } from './role.schema';

@Schema()
export class User {
  constructor(
    username: string,
    firstName: string,
    lastName: string,
    passwordHash: string,
    role: Role,
  ) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.passwordHash = passwordHash;
    this.role = role;
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

  @Prop()
  role: Role;

  @Prop({ type: [{ type: String }] })
  firebaseTokens: string[];

  hasRole!: (role: string) => boolean;
  isAdministrator!: () => boolean;
  isSuperAdministrator!: () => boolean;
  isAgent!: () => boolean;
  isCustomer!: () => boolean;
}

export const UserSchema = SchemaFactory.createForClass<User>(User);

export type UserDocument = User & Document;

UserSchema.index({ firstName: 'text', lastName: 'text' });

UserSchema.methods.hasRole = function (role: Role) {
  return this.role === role;
};

UserSchema.methods.isAdministrator = function () {
  return this.role === Role.ADMINISTRATOR;
};

UserSchema.methods.isCustomer = function () {
  return this.role === Role.CUSTOMER;
};

UserSchema.methods.isAgent = function () {
  return this.role === Role.AGENT;
};
