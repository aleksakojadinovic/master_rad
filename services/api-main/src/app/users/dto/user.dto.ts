import { RoleDTO } from './role.dto';

export class UserDTO {
  constructor(
    public id: string,
    public username: string,
    public firstName: string,
    public lastName: string,
    public roles: RoleDTO[],
  ) {}
}
