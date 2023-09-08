import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDb } from '../infrastructure/schema/user.schema';
import { Model } from 'mongoose';
import { UsersQueryDTO } from '../api/dto/users-query.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserDb.name) private userModel: Model<UserDb>,
    private usersRepository: UsersRepository,
  ) {}

  //TODO
  findAll({
    roles,
    page,
    perPage,
    searchString,
  }: UsersQueryDTO): Promise<User[]> {
    return this.usersRepository.findAll({
      roles,
      page,
      perPage,
      search: searchString,
    });
  }

  async findByUsername(username: string) {
    return this.usersRepository.findByUsername(username, true);
  }

  findOne(id: string) {
    return this.usersRepository.findById(id);
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  registerFirebaseToken(user: User, token: string) {
    return this.usersRepository.addFirebaseToken(user.id, token);
  }

  async removeFirebaseToken(user: User, token: string) {
    return this.usersRepository.removeFirebaseToken(user.id, token);
  }
}
