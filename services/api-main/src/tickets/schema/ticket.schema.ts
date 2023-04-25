// TODO: Split to multiple files

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../users/schema/user.schema';
import { v4 as uuid } from 'uuid';
import {
  TicketHistoryEntryBodyChanged,
  TicketHistoryEntryCommentAdded,
  TicketHistoryEntryCreated,
  TicketHistoryEntryDeleted,
  TicketHistoryEntryStatusChange,
  TicketHistoryEntryTitleChanged,
  TicketHistoryEntryTypeUnion,
} from './ticket-history.schema';
import { TicketHistoryEntryType } from '../types';

export class TicketHistoryItem {
  constructor(
    public groupId: string,
    public timestamp: Date,
    // I'm not sure whether this can be automatically connected to the mongoose Object id
    public initiator: User,
    public note: string,
    public entryType: TicketHistoryEntryType,
    public entry: TicketHistoryEntryTypeUnion,
  ) {}

  static create({
    groupId,
    timestamp,
    initiator,
    note,
    entry,
  }: {
    groupId?: string;
    timestamp?: Date;
    initiator: User;
    note?: string;
    entry: TicketHistoryEntryTypeUnion;
  }): TicketHistoryItem {
    const resolvedGroupId = groupId ?? uuid();
    const resolvedTimestamp = timestamp ?? new Date();
    const resolvedNote = note ?? '';

    let type: TicketHistoryEntryType;

    if (entry instanceof TicketHistoryEntryCreated) {
      type = TicketHistoryEntryType.CREATED;
    }

    if (entry instanceof TicketHistoryEntryDeleted) {
      type = TicketHistoryEntryType.DELETED;
    }

    if (entry instanceof TicketHistoryEntryStatusChange) {
      type = TicketHistoryEntryType.STATUS_CHANGED;
    }

    if (entry instanceof TicketHistoryEntryCommentAdded) {
      type = TicketHistoryEntryType.COMMEND_ADDED;
    }

    if (entry instanceof TicketHistoryEntryTitleChanged) {
      type = TicketHistoryEntryType.TITLE_CHANGED;
    }

    if (entry instanceof TicketHistoryEntryBodyChanged) {
      type = TicketHistoryEntryType.BODY_CHANGED;
    }

    return new TicketHistoryItem(
      resolvedGroupId,
      resolvedTimestamp,
      initiator,
      resolvedNote,
      type,
      entry,
    );
  }
}

export const TicketHistoryItemSchemaType = {
  timestamp: Date,
  initiator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: String,
  entryType: { type: Number, enum: TicketHistoryEntryType },
  entry: { type: Object },
};

@Schema()
export class Ticket {
  constructor() {
    this.history = [];
  }

  _id: string;

  @Prop({ type: [{ type: TicketHistoryItemSchemaType }] })
  history: TicketHistoryItem[];
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
