export class CreateUserResponseDto {
  constructor(
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    roles: string[],
  ) {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.roles = roles;
  }
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
}
