import { UserDTO } from '../dto/user-dto';
import { Role } from '../schema/role.schema';
import { User } from '../schema/user.schema';

export function getRoleDTO(role: Role) {
  return role.name;
}

export function getUserDTO(user: User) {
  return new UserDTO(
    user._id,
    user.username,
    user.firstName,
    user.lastName,
    user.roles.map(getRoleDTO),
  );
}
