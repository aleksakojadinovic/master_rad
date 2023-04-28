import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { getPasswordHash } from 'src/utils';
import { RolesService } from './roles.service';
import { Role } from 'src/users/schema/role.schema';

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
      await getPasswordHash(dto.password),
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

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // TODO: maybe add repository layer to handle these populate calls
  async findByUsername(username: string) {
    const user = await this.userModel
      .findOne({ username })
      .select('+passwordHash')
      .populate('roles');
    return user as User;
  }

  async findOne(id: string) {
    return (await this.userModel.findById(id).populate('roles')) as User;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
