import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Role } from './role.schema';
import mongoose from 'mongoose';
import { UserDTO } from '../dto/user-dto';

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
  username: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ type: String, select: false })
  passwordHash: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  roles: Role[];

  getFullName!: () => string;

  getDTO!: () => UserDTO;
}

export const UserSchema = SchemaFactory.createForClass<User>(User);

UserSchema.methods.getFullName = function () {
  return this.firstName + ' ' + this.lastName;
};

UserSchema.methods.getDTO = function () {
  return new UserDTO(
    this._id,
    this.username,
    this.firstName,
    this.lastName,
    this.roles.map((role: Role) => role.getDTO()),
  );
};
