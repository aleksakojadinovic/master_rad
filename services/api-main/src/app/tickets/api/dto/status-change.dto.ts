import { UserDTO } from 'src/app/users/api/dto/user.dto';
import { TicketStatus } from '../../domain/value-objects/ticket-status';

export class StatusChangeDTO {
  constructor(
    public statusFrom: TicketStatus,
    public statusTo: TicketStatus,
    public user: UserDTO | string,
    public timestamp: Date,
    public changeIndex: number,
  ) {}
}
