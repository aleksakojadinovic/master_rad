import { User } from 'src/app/users/domain/entities/user.entity';
import { Ticket } from 'src/app/tickets/domain/entities/ticket.entity';
import { NotificationPayloadCommentAdded } from '../value-objects/notification-payload-comment-added';
import { NotificationPayloadAssigned } from '../value-objects/notification-payload-assigned';
import { NotificationPayload } from '../value-objects/notification-payload';
import { Notification } from '../entities/notification.entity';

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

  build(): NotificationPayloadCommentAdded {
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
      !this.ticket.comments.find(
        (comment) => comment.commentId === this.commentId,
      )
    ) {
      throw new Error(
        `Comment with id ${this.commentId} not found for ticket ${this.ticket.id}`,
      );
    }

    const payload = new NotificationPayloadCommentAdded();
    payload.comment = this.commentId;
    payload.user = this.user;
    payload.ticket = this.ticket;

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

  build(): NotificationPayloadAssigned {
    if (this.ticket === null) {
      throw new Error(`Assign notification requires ticket.`);
    }

    if (this.user === null) {
      throw new Error(`Assign notification requires user.`);
    }

    const payload = new NotificationPayloadAssigned();
    payload.ticket = this.ticket;
    payload.user = this.user;

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
  private user: User;
  private timestamp: Date = new Date();
  private payload: NotificationPayload | null = null;
  private type: string | null = null;

  forUser(user: User) {
    this.user = user;
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
    if (this.user === null) {
      throw new Error(`Notification requires target users.`);
    }

    if (this.payload === null) {
      throw new Error(`Notification requires a payload.`);
    }

    const notification = new Notification();

    notification.user = this.user;
    notification.createdAt = this.timestamp;
    notification.payload = this.payload;
    notification.type = this.type;

    return notification;
  }
}
