import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { RolesService } from './roles.service';
import { Role } from 'src/app/users/schema/role.schema';
import * as bcrypt from 'bcrypt';
import { UsersQueryDTO } from './dto/users-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private rolesService: RolesService,
  ) {}

  async create(dto: CreateUserDto): Promise<CreateUserResponseDto> {
    const roleNames = dto.roles ?? ['agent'];
    const roles: Role[] = [];
    for (const roleName of roleNames) {
      const role = await this.rolesService.findByName(roleName);
      roles.push(role);
    }

    const userObject = new User(
      dto.username,
      dto.firstName,
      dto.lastName,
      await bcrypt.hash(dto.password, 10),
      roles,
    );
    const user = new this.userModel(userObject);
    await user.save();

    return new CreateUserResponseDto(
      user.id,
      user.username,
      user.firstName,
      user.lastName,
      user.roles.map(({ name }) => name),
    );
  }

  async findAll(queryDTO: UsersQueryDTO, user: User): Promise<User[]> {
    const isSuperAdmin = user.roles
      .map(({ name }) => name)
      .includes('superadministrator');

    const superAdminId = await this.rolesService.findByName(
      'superadministrator',
    );
    const roleIds = await this.rolesService.findManyByName(queryDTO.roles);

    const query = this.userModel.find({});

    if (queryDTO.roles.length > 0) {
      query.where({ roles: { $in: roleIds } });
    }

    if (!isSuperAdmin) {
      query.where({ roles: { $nin: [superAdminId] } });
    }

    if (queryDTO.includes.includes('roles')) {
      query.populate({ path: 'roles', model: 'Role' });
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

  // TODO: maybe add repository layer to handle these populate calls
  async findByUsername(username: string) {
    const user = await this.userModel
      .findOne({ username })
      .select('+passwordHash')
      .populate('roles');
    return user;
  }

  findOne(id: string) {
    return this.userModel
      .findById(id)
      .select('-passwordHash')
      .populate('roles');
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async registerFirebaseToken(user: User, token: string) {
    await this.userModel.updateOne(
      { _id: user._id }, // replace "userIdHere" with the actual user's ObjectId
      {
        $addToSet: { firebaseTokens: token },
      },
    );
  }
}
