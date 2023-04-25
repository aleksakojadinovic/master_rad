import { UserDTO } from 'src/users/dto/user-dto';
import { TicketStatus } from '../types';

export class CreatedDTO {
  constructor(public timestamp: Date, public user: UserDTO) {}
}

export class CommentDTO {
  constructor(
    public user: UserDTO,
    public timestamp: Date,
    public body: string,
    public index: number,
  ) {}
}

export class StatusChangeDTO {
  constructor(
    public statusFrom: TicketStatus,
    public statusTo: TicketStatus,
    public timestamp: Date,
    public user: UserDTO,
    public index: number,
  ) {}
}

export class BodyHistoryDTO {
  constructor(
    public title: string,
    public timestamp: Date,
    public user: UserDTO,
  ) {}
}

export class TitleHistoryDTO {
  constructor(
    public title: string,
    public timestamp: Date,
    public user: UserDTO,
  ) {}
}

export class DeletedDTO {
  constructor(public timestamp: Date, public user: UserDTO) {}
}
