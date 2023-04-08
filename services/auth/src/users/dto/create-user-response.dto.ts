export class CreateUserResponseDto {
  constructor(id: string, firstName: string, lastName: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
  }
  id: string;
  firstName: string;
  lastName: string;
}
