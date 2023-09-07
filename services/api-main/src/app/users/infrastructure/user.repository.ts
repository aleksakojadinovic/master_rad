import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TicketDocument } from 'src/app/tickets/infrastructure/schema/ticket.schema';
import { Model } from 'mongoose';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserDb } from './schema/user.schema';
import { User } from '../domain/entities/user.entity';

export type UsersQuery = {};

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserDb.name) private userModel: Model<UserDb>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private static POPULATE = [];

  async findAll({}: UsersQuery): Promise<User[]> {
    const result = await this.userModel.find({});

    return result;
  }
}
