import { Role } from '../value-objects/role';
import { UserStatus } from '../value-objects/user-status';

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

  passwordHash: string;

  firebaseTokens: string[];

  status: UserStatus;

  isActive() {
    return this.status === UserStatus.ACTIVE;
  }

  isRegistered() {
    return this.status === UserStatus.REGISTERED;
  }

  isBanned() {
    return this.status === UserStatus.BANNED;
  }

  isAdministrator() {
    return this.role === Role.ADMINISTRATOR;
  }

  isAgent() {
    return this.role === Role.AGENT;
  }

  isCustomer() {
    return this.role === Role.CUSTOMER;
  }
}
