import { UserDTO } from 'src/app/users/dto/user.dto';
import { TicketHistoryItemDTO } from './ticket-history.dto';
import { TicketStatus } from '../types';
import { TicketTagDTO } from 'src/app/ticket-tag-system/dto/ticket-tag.dto';

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
