import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Ticket } from 'src/app/tickets/schema/ticket.schema';
import { User } from 'src/app/users/schema/user.schema';

@Schema()
export class CommentAddedNotificationPayload {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' })
  ticket: Ticket;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  commentId: string;
}

export const CommentAddedNotificationPayloadSchema =
  SchemaFactory.createForClass(CommentAddedNotificationPayload);

@Schema()
export class AssignedNotificationPayload {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' })
  ticket: Ticket;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const AssignedNotificationPayloadSchema = SchemaFactory.createForClass(
  AssignedNotificationPayload,
);

export type NotificationPayload =
  | CommentAddedNotificationPayload
  | AssignedNotificationPayload;

export class Notification {
  _id: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: User[];

  @Prop()
  createdAt: Date;

  @Prop()
  type: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: 'type' })
  payload: CommentAddedNotificationPayload | AssignedNotificationPayload;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
