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

  isFinalStatus() {
    return [TicketStatus.CLOSED, TicketStatus.RESOLVED].includes(this.status);
  }

  isOwner(user: User) {
    return this.createdBy.id === user.id;
  }

  hasTag(tag: TicketTag) {
    return this.tags.map((t) => t.id).includes(tag.id);
  }

  addTags(tags: TicketTag[]) {
    this.tags.push(...tags);
  }

  removeTags(tags: TicketTag[]) {
    const ids = tags.map((tag) => tag.id);
    this.tags = this.tags.filter((tag) => !ids.includes(tag.id));
  }

  addComment(
    commentId: string,
    user: User,
    body: string,
    isInternal: boolean,
    timestamp: Date,
  ) {
    const comment = new TicketComment();

    comment.commentId = commentId;
    comment.user = user;
    comment.body = body;
    comment.timestamp = timestamp;
    comment.isInternal = isInternal;

    this.comments.push(comment);
  }

  isAssigned(user: User) {
    return this.assignees.map((u) => u.id).includes(user.id);
  }

  assign(users: User[]) {
    this.assignees.push(...users);
  }

  unassign(users: User[]) {
    const ids = users.map((u) => u.id);
    this.assignees = this.assignees.filter((u) => !ids.includes(u.id));
  }
}
