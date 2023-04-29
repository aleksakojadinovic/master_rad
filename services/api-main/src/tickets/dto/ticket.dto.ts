import { UserDTO } from 'src/users/dto/user.dto';
import { TicketHistoryItemDTO } from './ticket-history.dto';
import { TicketState } from '../schema/ticket-state.schema';
import { TicketStateDTO } from './ticket-state.dto';

export class TicketDTO {
  constructor(
    public id: string,
    public state: TicketStateDTO,
    public history: TicketHistoryItemDTO[],
  ) {}
}
