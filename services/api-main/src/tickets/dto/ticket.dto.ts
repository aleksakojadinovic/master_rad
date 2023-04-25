import { UserDTO } from 'src/users/dto/user-dto';
import { TicketStatus } from '../types';

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
