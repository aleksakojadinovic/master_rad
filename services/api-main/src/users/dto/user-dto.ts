import { User } from 'src/schemas/user.schema';

export class UserDTO {
  constructor(
    public id: string,
    public username: string,
    public firstName: string,
    public lastName: string,
    public roles: string[],
  ) {}

  static mapFromModel(user: User) {
    return new UserDTO(
      user._id,
      user.username,
      user.firstName,
      user.lastName,
      user.roles.map(({ name }) => name),
    );
  }
}
