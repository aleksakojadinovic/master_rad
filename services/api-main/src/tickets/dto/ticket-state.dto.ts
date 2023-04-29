import { TicketStatus } from '../types';
import { UserDTO } from 'src/users/dto/user.dto';

export class TicketStateDTO {
  constructor(
    public id: string,
    public createdBy: UserDTO,
    public createdAt: Date,
    public title: string,
    public body: string,
    public status: TicketStatus,
  ) {}
}
