import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { User } from 'src/app/users/schema/user.schema';

export class CommentAddedNotificationPayload {
  ticketId: string;

  userId: string;

  commentId: string;
}

export class AssignedNotificationPayload {
  ticketId: string;

  userId: string;
}

export const AssignedNotificationPayloadSchema = SchemaFactory.createForClass(
  AssignedNotificationPayload,
);

export type NotificationPayload =
  | CommentAddedNotificationPayload
  | AssignedNotificationPayload;

@Schema()
export class Notification {
  _id: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: User[] | Types.ObjectId[];

  @Prop()
  createdAt: Date;

  @Prop()
  type: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  payload: CommentAddedNotificationPayload | AssignedNotificationPayload;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
