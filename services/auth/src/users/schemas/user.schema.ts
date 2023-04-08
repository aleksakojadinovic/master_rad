import { CreateUserDto } from './../dto/create-user.dto';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
@Schema()
export class User {
  constructor(firstName = '', lastName = '', passwordHash = '') {
    this.firstName = firstName;
    this.lastName = lastName;
    this.passwordHash = passwordHash;
  }

  static async createFromDTO(dto: CreateUserDto) {
    // TODO: Validation all around
    const passwordHash = await bcrypt.hash(dto.password, 10);
    return new User(dto.firstName, dto.lastName, passwordHash);
  }

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
