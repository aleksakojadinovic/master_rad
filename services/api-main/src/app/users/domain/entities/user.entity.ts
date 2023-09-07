import { Role } from '../value-objects/role';

export class User {
  id: string;

  username: string;

  firstName: string;

  lastName: string;

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get initials() {
    return `${this.firstName[0]}${this.lastName[0]}`;
  }

  role: Role;
}
