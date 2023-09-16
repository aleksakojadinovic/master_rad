import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserDb } from './schema/user.schema';
import { User } from '../domain/entities/user.entity';
import { PaginatedValue } from 'src/codebase/types/PaginatedValue';
import { createPaginatedResponse } from 'src/codebase/utils';

export type UsersQuery = {
  roles?: string[] | null;
  search?: string | null;
  page?: number;
  perPage?: number;
  includePassword?: boolean;
};

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserDb.name) private userModel: Model<UserDb>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private static POPULATE = [];

  async findAll({
    roles = null,
    search = null,
    page = 1,
    perPage = 100,
    includePassword = false,
  }: UsersQuery): Promise<PaginatedValue<User>> {
    const query = this.userModel.find({});
    const countQuery = this.userModel.find({});

    if (roles && roles.length > 0) {
      query.where({ role: { $in: roles } });
      countQuery.where({ role: { $in: roles } });
    }

    if (search && search.trim().length > 0) {
      query.where({
        $or: [
          { firstName: { $regex: new RegExp(search, 'i') } },
          { lastName: { $regex: new RegExp(search, 'i') } },
        ],
      });
      countQuery.where({
        $or: [
          { firstName: { $regex: new RegExp(search, 'i') } },
          { lastName: { $regex: new RegExp(search, 'i') } },
        ],
      });
    }

    if (includePassword) {
      query.select('+passwordHash');
    }

    if (page && perPage) {
      query.skip((page - 1) * perPage).limit(perPage);
    }

    query.populate(UsersRepository.POPULATE);
    const [result, count] = await Promise.all([
      query.exec(),
      countQuery.countDocuments(),
    ]);

    const users = this.mapper.mapArray(result, UserDb, User);
    return createPaginatedResponse(users, page, perPage, count);
  }

  async findByUsername(
    username: string,
    includePassword = false,
  ): Promise<User | null> {
    const query = this.userModel
      .findOne()
      .where({ username })
      .populate(UsersRepository.POPULATE);

    if (includePassword) {
      query.select('+passwordHash');
    }

    const result = await query.exec();

    if (!result) {
      return null;
    }

    return this.mapper.map(result, UserDb, User);
  }

  async findById(id: string, includePassword = false): Promise<User | null> {
    const query = this.userModel
      .findById(id)
      .populate(UsersRepository.POPULATE);

    if (includePassword) {
      query.select('+passwordHash');
    }

    const result = await query.exec();

    if (!result) {
      return null;
    }

    return this.mapper.map(result, UserDb, User);
  }

  addFirebaseToken(id: string, token: string) {
    return this.userModel.updateOne(
      { _id: id },
      {
        $addToSet: { firebaseTokens: token },
      },
    );
  }

  removeFirebaseToken(id: string, token: string) {
    return this.userModel.updateOne(
      { _id: id },
      {
        $pull: { firebaseTokens: token },
      },
    );
  }
}
