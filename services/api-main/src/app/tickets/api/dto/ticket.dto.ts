import { UserDTO } from 'src/app/users/api/dto/user.dto';
import { TicketTagDTO } from 'src/app/ticket-tag-system/api/dto/ticket-tag.dto';
import { TicketStatus } from '../../domain/value-objects/ticket-status';
import { CommentDTO } from './comment.dto';

export class TicketDTO {
  id: string;
  createdAt: Date;
  createdBy: UserDTO | string;
  title: string;
  body: string;
  assignees: UserDTO[] | string[];
  status: TicketStatus;
  tags: TicketTagDTO[] | string[];
  comments: CommentDTO[];
}