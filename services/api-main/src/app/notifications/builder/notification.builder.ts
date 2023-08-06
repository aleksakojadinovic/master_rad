import { User } from 'src/app/users/schema/user.schema';
import {
  AssignedNotificationPayload,
  CommentAddedNotificationPayload,
  Notification,
  NotificationPayload,
} from '../schema/notification.schema';
import { Ticket } from 'src/app/tickets/schema/ticket.schema';
import { TicketHistoryEntryType } from 'src/app/tickets/types';
import { TicketHistoryEntryCommentAdded } from 'src/app/tickets/schema/ticket-history.schema';

interface Instantiable<T> {
  new (...args: any[]): T;
}

export class CommentAddedNotificationPayloadBuilder {
  private commentId: string | null = null;
  private user: User | null = null;
  private ticket: Ticket | null = null;

  hasCommentId(commentId: string) {
    this.commentId = commentId;
    return this;
  }

  byUser(user: User) {
    this.user = user;
    return this;
  }

  atTicket(ticket: Ticket) {
    this.ticket = ticket;
    return this;
  }

  build(): CommentAddedNotificationPayload {
    if (this.commentId === null) {
      throw new Error(`Comment notification requires comment id.`);
    }

    if (this.user === null) {
      throw new Error(`Comment notification requires comment author (user).`);
    }

    if (this.ticket === null) {
      throw new Error(`Comment notification requires ticket.`);
    }

    if (
      !this.ticket.history
        .filter(
          (item) => item.entryType === TicketHistoryEntryType.COMMEND_ADDED,
        )
        .map((item) => item.entry as TicketHistoryEntryCommentAdded)
        .find((entry) => entry.commentId === this.commentId)
    ) {
      throw new Error(
        `Comment with id ${this.commentId} not found for ticket ${this.ticket._id}`,
      );
    }

    const payload = new CommentAddedNotificationPayload();
    payload.comment = this.commentId;
    payload.user = this.user._id.toString();
    payload.ticket = this.ticket._id.toString();

    return payload;
  }
}

export class AssignedNotificationPayloadBuilder {
  private ticket: Ticket | null = null;
  private user: User | null = null;

  atTicket(ticket: Ticket) {
    this.ticket = ticket;
    return this;
  }

  byUser(user: User) {
    this.user = user;
    return this;
  }

  build(): AssignedNotificationPayload {
    if (this.ticket === null) {
      throw new Error(`Assign notification requires ticket.`);
    }

    if (this.user === null) {
      throw new Error(`Assign notification requires user.`);
    }

    const payload = new AssignedNotificationPayload();
    payload.ticket = this.ticket._id.toString();
    payload.user = this.user._id.toString();

    return payload;
  }
}

type BuilderTypeMap = {
  comment_added: CommentAddedNotificationPayloadBuilder;
  assigned: AssignedNotificationPayloadBuilder;
};

const BuilderInstanceMap: {
  [P in keyof BuilderTypeMap]: Instantiable<BuilderTypeMap[P]>;
} = {
  comment_added: CommentAddedNotificationPayloadBuilder,
  assigned: AssignedNotificationPayloadBuilder,
};

const PayloadTypeMap: {
  [P in keyof BuilderTypeMap]: string;
} = {
  comment_added: 'CommentAddedNotification',
  assigned: 'AssignedNotification',
};

export class NotificationBuilder {
  private users: User[] | null;
  private timestamp: Date = new Date();
  private payload: NotificationPayload | null = null;
  private type: string | null = null;

  forUsers(users: User[]) {
    this.users = users;
    return this;
  }

  atTimestamp(timestamp: Date) {
    this.timestamp = timestamp;
    return this;
  }

  hasPayload<T extends keyof BuilderTypeMap>(
    payloadType: T,
    builderCallback: (builder: BuilderTypeMap[T]) => void,
  ) {
    const Builder = BuilderInstanceMap[payloadType];
    const builder = new Builder();
    builderCallback(builder);
    const payload = builder.build();
    this.payload = payload;

    this.type = PayloadTypeMap[payloadType];

    return this;
  }

  build(): Notification {
    if (this.users === null) {
      throw new Error(`Notification requires target users.`);
    }

    if (this.users.length === 0) {
      throw new Error(`Notification target users cannot be empty.`);
    }

    if (this.payload === null) {
      throw new Error(`Notification requires a payload.`);
    }

    const notification = new Notification();

    notification.users = this.users;
    notification.createdAt = this.timestamp;
    notification.payload = this.payload;
    notification.type = this.type;

    return notification;
  }
}
