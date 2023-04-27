import { UserDTO } from 'src/users/dto/user-dto';
import { TicketHistoryItemDTO } from './ticket-history.dto';

export class TicketDTO {
  constructor(
    public id: string,
    public title: string,
    public createdUser: UserDTO,
    public body: string,
    public createdAt: Date,
    public status: number,
    public history: TicketHistoryItemDTO[],
  ) {}
}
