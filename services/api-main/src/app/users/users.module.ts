import { Module } from '@nestjs/common';
import { UsersService } from './domain/users.service';
import { UsersController } from './api/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './infrastructure/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
