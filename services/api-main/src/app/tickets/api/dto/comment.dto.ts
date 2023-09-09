import { UserDTO } from 'src/app/users/api/dto/user.dto';

export class CommentDTO {
  constructor(
    public commentId: string,
    public createdAt: Date,
    public user: UserDTO | string,
    public body: string,
  ) {}
}
