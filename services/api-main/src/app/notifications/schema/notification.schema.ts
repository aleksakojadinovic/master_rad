import { Ticket } from './../../tickets/schema/ticket.schema';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/app/users/schema/user.schema';

export class CommentAddedNotificationPayload {
  ticket: Ticket | string;

  user: User | string;

  comment: string;
}

export class AssignedNotificationPayload {
  ticket: Ticket | string;

  user: User | string;
}

export type NotificationPayload =
  | CommentAddedNotificationPayload
  | AssignedNotificationPayload;

@Schema()
export class Notification {
  _id: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: User[];

  @Prop()
  createdAt: Date;

  @Prop()
  readAt: Date | null;

  @Prop()
  type: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  payload: CommentAddedNotificationPayload | AssignedNotificationPayload;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

export type NotificationDocument = Notification & Document;
