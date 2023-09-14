import { User } from 'src/app/users/domain/entities/user.entity';
import { TicketStatus } from '../value-objects/ticket-status';
import { TicketComment } from '../value-objects/ticket-comment';
import { TicketStatusChange } from '../value-objects/ticket-status-change';
import { TicketTag } from 'src/app/ticket-tag-system/domain/entities/ticket-tag.entity';
import { TicketAssigneeChange } from '../value-objects/ticket-assignee-change';

export class Ticket {
  id: string;

  title: string;

  body: string;

  createdAt: Date;

  createdBy: User;

  status: TicketStatus;

  assignees: User[];

  tags: TicketTag[];

  comments: TicketComment[];

  statusChanges: TicketStatusChange[];

  assigneeChanges: TicketAssigneeChange[];
}
