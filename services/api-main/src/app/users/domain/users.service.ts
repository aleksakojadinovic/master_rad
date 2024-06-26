import { Injectable } from '@nestjs/common';
import { UsersQueryDTO } from '../api/dto/users-query.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { User } from './entities/user.entity';
import { PaginatedValue } from 'src/codebase/types/PaginatedValue';
import { Role } from './value-objects/role';
import { CannotChangeYourRoleError } from './errors/CannotChangeYourRole';
import { CannotUpdateSomeoneElsesFirebaseTokenError } from './errors/CannotUpdateSomeoneElsesFirebaseToken';
import { OnlyAdminsCanChangeRolesError } from './errors/OnlyAdminsCanChangeRoles';
import { UserStatus } from './value-objects/user-status';
import { OnlyAdminsCanChangeStatusError } from './errors/OnlyAdminsCanChangeStatus';
import { CannotChangeYourStatusError } from './errors/CannotChangeYourStatus';
import { CannotChangeSomeoneElsesPasswordError } from './errors/CannotChangeSomeoneElsesPassword';
import * as bcrypt from 'bcrypt';
import { OldPasswordInvalidError } from './errors/OldPasswordInvalid';
import { CreateUserDto } from '../api/dto/create-user.dto';
import { UsernameTakenError } from './errors/UsernameTaken';
import { UserFactory } from './factories/user.factory';

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

  findByIds(ids: string[]) {
    return this.usersRepository.findByIds(ids);
  }

  async findByUsername(username: string, includePassword = false) {
    return this.usersRepository.findByUsername(username, includePassword);
  }

  findOne(id: string) {
    return this.usersRepository.findById(id);
  }

  registerFirebaseToken(id: string, requester: User, token: string) {
    if (id !== requester.id) {
      throw new CannotUpdateSomeoneElsesFirebaseTokenError();
    }
    return this.usersRepository.addFirebaseToken(requester.id, token);
  }

  async removeFirebaseToken(user: User, token: string) {
    return this.usersRepository.removeFirebaseToken(user.id, token);
  }

  async updateRole(userId: string, requester: User, role: Role) {
    // Only admins, and plus you can't change your own
    if (!requester.isAdministrator()) {
      throw new OnlyAdminsCanChangeRolesError();
    }

    if (userId === requester.id) {
      throw new CannotChangeYourRoleError();
    }

    return this.usersRepository.updateRole(userId, role);
  }

  updateStatus(userId: string, requester: User, status: UserStatus) {
    if (!requester.isAdministrator()) {
      throw new OnlyAdminsCanChangeStatusError();
    }

    if (userId === requester.id) {
      throw new CannotChangeYourStatusError();
    }

    return this.usersRepository.updateStatus(userId, status);
  }

  async toggleAIAccess(userId: string, requester: User) {
    if (!requester.isAdministrator()) {
      throw new OnlyAdminsCanChangeStatusError();
    }

    return this.usersRepository.toggleAIAccess(userId);
  }

  async changePassword(
    id: string,
    requester: User,
    oldPassword: string,
    newPassword: string,
  ) {
    if (id !== requester.id) {
      throw new CannotChangeSomeoneElsesPasswordError();
    }

    const user = await this.usersRepository.findById(id, true);
    if (!(await bcrypt.compare(oldPassword, user.passwordHash))) {
      throw new OldPasswordInvalidError();
    }

    await this.usersRepository.changePassword(id, newPassword);
  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.usersRepository.findByUsername(
      dto.username,
    );

    if (existingUser) {
      throw new UsernameTakenError();
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const newUser = UserFactory.create((builder) =>
      builder
        .hasUsername(dto.username)
        .hasFirstName(dto.firstName)
        .hasLastName(dto.lastName)
        .hasPasswordHash(passwordHash)
        .hasRole(Role.CUSTOMER),
    );

    const createdUser = await this.usersRepository.create(newUser);

    return createdUser;
  }
}
