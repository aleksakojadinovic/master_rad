import { UserDTO } from 'src/app/users/api/dto/user.dto';
import { TicketHistoryItemDTO } from './ticket-history.dto';
import { TicketTagDTO } from 'src/app/ticket-tag-system/api/dto/ticket-tag.dto';
import { TicketStatus } from '../../domain/value-objects/ticket-status';

export class TicketDTO {
  constructor(
    public id: string,
    public createdBy: UserDTO | string,
    public assignees: UserDTO[] | string[],
    public createdAt: Date,
    public title: string,
    public body: string,
    public status: TicketStatus,
    public history: TicketHistoryItemDTO[],
    public tags: TicketTagDTO[] | string[],
  ) {}
}
