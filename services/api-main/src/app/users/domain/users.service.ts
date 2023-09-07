import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../api/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDb } from '../infrastructure/schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UsersQueryDTO } from '../api/dto/users-query.dto';
import { ROLE_VALUES, Role } from './value-objects/role';

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserDb.name) private userModel: Model<UserDb>) {}

  // async create(dto: CreateUserDto): Promise<User> {
  //   const role = ROLE_VALUES[dto.role] ?? Role.CUSTOMER;

  //   const userObject = new User(
  //     dto.username,
  //     dto.firstName,
  //     dto.lastName,
  //     await bcrypt.hash(dto.password, 10),
  //     role,
  //   );
  //   const user = new this.userModel(userObject);
  //   await user.save();

  //   return user;
  // }

  //TODO
  async findAll(queryDTO: UsersQueryDTO): Promise<User[]> {
    const query = this.userModel.find({});

    if (queryDTO.roles.length > 0) {
      query.where({ role: { $in: queryDTO.roles } });
    }

    if (queryDTO.searchString) {
      query.where({
        $or: [
          { firstName: { $regex: new RegExp(queryDTO.searchString, 'i') } },
          { lastName: { $regex: new RegExp(queryDTO.searchString, 'i') } },
        ],
      });
    }

    if (queryDTO.page && queryDTO.perPage) {
      query
        .skip((queryDTO.page - 1) * queryDTO.perPage)
        .limit(queryDTO.perPage);
    }

    return query.exec();
  }

  async findByUsername(username: string) {
    const user = await this.userModel
      .findOne({ username })
      .select('+passwordHash');
    return user;
  }

  findOne(id: string) {
    return this.userModel.findById(id).select('-passwordHash');
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  registerFirebaseToken(user: User, token: string) {
    return this.userModel.updateOne(
      { _id: user._id },
      {
        $addToSet: { firebaseTokens: token },
      },
    );
  }

  async removeFirebaseToken(user: User, token: string) {
    return this.userModel.updateOne(
      { _id: user._id },
      { $pull: { firebaseTokens: token } },
    );
  }
}
