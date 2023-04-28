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
}

export const UserSchema = SchemaFactory.createForClass<User>(User);
