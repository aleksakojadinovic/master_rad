import { UserDTO } from 'src/users/dto/user.dto';
import { TicketHistoryItemDTO } from './ticket-history.dto';
import { TicketState } from '../schema/ticket-state.schema';

export class TicketDTO {
  constructor(
    public id: string,
    public state: TicketState,
    public history: TicketHistoryItemDTO[],
  ) {}
}
