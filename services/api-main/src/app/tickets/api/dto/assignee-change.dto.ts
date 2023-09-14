import { UserDTO } from 'src/app/users/api/dto/user.dto';

export class AssigneeChangeDTO {
  user: UserDTO | string;
  timestamp: Date;
  added: UserDTO[] | string[];
  removed: UserDTO[] | string[];
}
