import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AutoMap } from '@automapper/classes';
import { Role } from '../../domain/value-objects/role';

@Schema({ collection: 'user' })
export class UserDb {
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
}

export const UserSchema = SchemaFactory.createForClass<UserDb>(UserDb);

export type UserDocument = UserDb & Document;