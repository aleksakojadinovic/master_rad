import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/app/users/schema/role.schema';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async findByName(name: string): Promise<Role> {
    return await this.roleModel.findOne({ name });
  }

  async findMany(ids: string[]): Promise<Role[]> {
    return await this.roleModel.find({ _id: { $in: ids } });
  }

  async findAll(): Promise<Role[]> {
    return await this.roleModel.find({});
  }

  async findById(id: string): Promise<Role> {
    return await this.roleModel.findById(id);
  }
}
