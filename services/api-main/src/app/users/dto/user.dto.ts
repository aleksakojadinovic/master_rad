export class UserDTO {
  constructor(
    public id: string,
    public username: string,
    public firstName: string,
    public lastName: string,
    public role: string,
    public fullName: string,
  ) {}
}
