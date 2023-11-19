import { User } from '../entities/user.entity';
import { Role } from '../value-objects/role';
import { UserStatus } from '../value-objects/user-status';

export class UserBuilder {
  private username = '';
  private passwordHash = '';
  private firstName = '';
  private lastName = '';
  private role: Role = Role.CUSTOMER;
  private status: UserStatus = UserStatus.REGISTERED;

  hasUsername(username: string) {
    this.username = username;
    return this;
  }

  hasPasswordHash(passwordHash: string) {
    this.passwordHash = passwordHash;
    return this;
  }

  hasFirstName(firstName: string) {
    this.firstName = firstName;
    return this;
  }

  hasLastName(lastName: string) {
    this.lastName = lastName;
    return this;
  }

  hasRole(role: Role) {
    this.role = role;
    return this;
  }

  build(): User {
    if (!this.username) {
      throw new Error(`User requires a username.`);
    }

    if (!this.passwordHash) {
      throw new Error(`User requires a password hash.`);
    }

    if (!this.firstName) {
      throw new Error(`User requires a first name.`);
    }

    if (!this.lastName) {
      throw new Error(`User requires a last name.`);
    }

    const user = new User();
    user.firstName = this.firstName;
    user.lastName = this.lastName;
    user.username = this.username;
    user.passwordHash = this.passwordHash;
    user.role = this.role;
    user.status = this.status;

    return user;
  }
}
