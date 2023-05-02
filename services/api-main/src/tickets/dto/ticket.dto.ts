import { UserDTO } from 'src/users/dto/user.dto';
import { TicketHistoryItemDTO } from './ticket-history.dto';
import { TicketStatus } from '../types';

export class TicketDTO {
  constructor(
    public id: string,
    public createdBy: UserDTO,
    public createdAt: Date,
    public title: string,
    public body: string,
    public status: TicketStatus,
    public history: TicketHistoryItemDTO[],
  ) {}
}
