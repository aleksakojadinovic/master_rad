import { UserDTO } from 'src/app/users/dto/user.dto';
import { TicketHistoryEntryType } from '../types';

export class TicketHistoryItemDTO {
  constructor(
    public user: UserDTO,
    public timestamp: Date,
    public type: TicketHistoryEntryType,
    public payload: any,
  ) {}
}
