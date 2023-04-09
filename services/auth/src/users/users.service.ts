import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserResponseDto } from './dto/create-user-response.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    // const userObject = await User.createFromDTO(createUserDto);
    // const user = new this.userModel(userObject);
    // await user.save();
    // const response = new CreateUserResponseDto(
    //   user.id.toString(),
    //   user.firstName,
    //   user.lastName,
    // );
    // return response;
    return null;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByUserName(username: string): Promise<User | null> {
    return await this.userModel.findOne({ username });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
