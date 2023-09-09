import { TicketDb } from '../../../tickets/infrastructure/schema/ticket.schema';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { UserDb } from 'src/app/users/infrastructure/schema/user.schema';

export class CommentAddedNotificationPayloadDb {
  ticket: TicketDb;

  user: UserDb;

  comment: string;
}

export class AssignedNotificationPayloadDb {
  ticket: TicketDb;

  user: UserDb;
}

export type NotificationPayload =
  | CommentAddedNotificationPayloadDb
  | AssignedNotificationPayloadDb;

@Schema()
export class NotificationDb {
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: UserDb;

  @Prop()
  createdAt: Date;

  @Prop()
  readAt: Date | null;

  @Prop()
  type: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  payload: CommentAddedNotificationPayloadDb | AssignedNotificationPayloadDb;
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationDb);

export type NotificationDocument = NotificationDb & Document;
