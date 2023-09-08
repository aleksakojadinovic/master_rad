import { Module } from '@nestjs/common';
import { UsersService } from './domain/users.service';
import { UsersController } from './api/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDb, UserSchema } from './infrastructure/schema/user.schema';
import { UsersRepository } from './infrastructure/users.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserDb.name, schema: UserSchema }]),
  ],
  exports: [UsersService, UsersRepository],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
