import { User } from 'src/app/users/domain/entities/user.entity';
import { TicketStatus } from './ticket-status';

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
  // TODO: tags go here.
  added: string[];
  removed: string[];
}

export type TicketHistoryPayload =
  | CreatedPayload
  | CommentAddedPayload
  | AssigneeAddedPayload
  | StatusChangedPayload;

export class TicketHistoryEntry {
  timestamp: Date;
  user: User;
  payload: TicketHistoryEntry;
}
