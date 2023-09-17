import { UserDTO } from 'src/app/users/api/dto/user.dto';

export class CommentDTO {
  commentId: string;
  createdAt: Date;
  user: UserDTO | string;
  body: string;
  timestamp: Date;
  updatedAt: Date;
  isInternal: boolean;
}
