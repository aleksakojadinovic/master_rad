import { Injectable } from '@nestjs/common';
import { UsersQueryDTO } from '../api/dto/users-query.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { User } from './entities/user.entity';
import { PaginatedValue } from 'src/codebase/types/PaginatedValue';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  findAll({
    roles,
    statuses,
    page,
    perPage,
    searchString,
  }: UsersQueryDTO): Promise<PaginatedValue<User>> {
    return this.usersRepository.findAll({
      roles,
      statuses,
      page,
      perPage,
      search: searchString,
    });
  }

  async findByUsername(username: string, includePassword = false) {
    return this.usersRepository.findByUsername(username, includePassword);
  }

  findOne(id: string) {
    return this.usersRepository.findById(id);
  }

  registerFirebaseToken(user: User, token: string) {
    return this.usersRepository.addFirebaseToken(user.id, token);
  }

  async removeFirebaseToken(user: User, token: string) {
    return this.usersRepository.removeFirebaseToken(user.id, token);
  }
}
