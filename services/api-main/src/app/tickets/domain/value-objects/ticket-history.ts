import { User } from 'src/app/users/domain/entities/user.entity';
import { TicketStatus } from './ticket-status';
import { TicketTag } from 'src/app/ticket-tag-system/domain/entities/ticket-tag.entity';

export class CreatedPayload {
  user: User;
}
export class CommentAddedPayload {
  commentId: string;
  body: string;
}
export class AssigneeAddedPayload {
  user: User;
}
export class StatusChangedPayload {
  status: TicketStatus;
}

export class TagsChangedPayload {
  tags: TicketTag[];
}

export type TicketHistoryPayload =
  | CreatedPayload
  | CommentAddedPayload
  | AssigneeAddedPayload
  | StatusChangedPayload
  | TagsChangedPayload;

export class TicketHistoryEntry {
  timestamp: Date;
  initiator: User;
  payload: TicketHistoryEntry;
}
