import { Ticket } from 'src/tickets/schema/ticket.schema';
import { UserDTO } from 'src/users/dto/user-dto';
import {
  TicketHistoryEntryBodyChanged,
  TicketHistoryEntryCommentAdded,
  TicketHistoryEntryCreated,
  TicketHistoryEntryStatusChange,
  TicketHistoryEntryTitleChanged,
  TicketHistoryEntryType,
} from '../schema/ticket-history.schema';
import { TicketStatus } from '../types';
import { getUserDTO } from 'src/users/mappers/users-mapper';

class CommentDTO {
  constructor(
    public user: UserDTO,
    public timestamp: Date,
    public body: string,
    public index: number,
  ) {}
}

class StatusChangeDTO {
  constructor(
    public statusFrom: TicketStatus,
    public statusTo: TicketStatus,
    public timestamp: Date,
    public user: UserDTO,
    public index: number,
  ) {}
}

export class TicketDTO {
  constructor(
    public id: string,
    public title: string,
    public createdUser: UserDTO,
    public body: string,
    public createdAt: Date,
    public status: string,
    public comments: CommentDTO[],
    public statusChanges: StatusChangeDTO[],
  ) {}
}
