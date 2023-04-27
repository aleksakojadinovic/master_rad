/* eslint-disable @typescript-eslint/ban-types */
// TODO: Split to multiple files

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  TicketHistoryEntryBodyChanged,
  TicketHistoryEntryCreated,
  TicketHistoryEntryStatusChange,
  TicketHistoryEntryTitleChanged,
  TicketHistoryItem,
  TicketHistoryItemSchemaType,
} from './ticket-history.schema';
import { TicketDTO } from '../dto/ticket.dto';
import { TicketHistoryEntryType, TicketStatus } from '../types';
import { User } from 'src/users/schema/user.schema';
import { TicketHistoryItemDTO } from '../dto/ticket-history.dto';

@Schema()
export class Ticket {
  constructor() {
    this.history = [];
  }

  _id: string;

  @Prop({ type: [{ type: TicketHistoryItemSchemaType }] })
  history: TicketHistoryItem[];

  getInitialItem!: () => TicketHistoryItem;

  getInitialEntry!: () => TicketHistoryEntryCreated;

  getTitle!: () => string;

  getBody!: () => string;

  getStatus!: () => TicketStatus;

  getCreatedUser!: () => User;

  getCreatedAt!: () => Date;

  getDTO!: () => TicketDTO;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

TicketSchema.methods.getInitialItem = function () {
  return this.history[0];
};

TicketSchema.methods.getInitialEntry = function () {
  return this.getInitialItem().entry as TicketHistoryEntryCreated;
};

TicketSchema.methods.getTitle = function () {
  const titles = this.history
    .filter(
      (item: TicketHistoryItem) =>
        item.entryType === TicketHistoryEntryType.TITLE_CHANGED,
    )
    .map(
      (item: TicketHistoryItem) => item.entry as TicketHistoryEntryTitleChanged,
    )
    .map((entry: TicketHistoryEntryTitleChanged) => entry.title);

  return titles[titles.length - 1];
};

TicketSchema.methods.getBody = function () {
  const bodies = this.history
    .filter((item) => item.entryType === TicketHistoryEntryType.BODY_CHANGED)
    .map((item) => item.entry as TicketHistoryEntryBodyChanged)
    .map((entry) => entry.body);

  return bodies[bodies.length - 1];
};

TicketSchema.methods.getStatus = function () {
  const statuses = this.history
    .filter((item) => item.entryType === TicketHistoryEntryType.STATUS_CHANGED)
    .map((item) => item.entry as TicketHistoryEntryStatusChange)
    .map((entry) => entry.status);

  return statuses[statuses.length - 1];
};

TicketSchema.methods.getCreatedUser = function () {
  return this.getInitialItem().initiator;
};

TicketSchema.methods.getCreatedAt = function () {
  return this.getInitialItem().timestamp;
};

TicketSchema.methods.getDTO = function () {
  return new TicketDTO(
    this._id,
    this.getTitle(),
    this.getCreatedUser().getDTO(),
    this.getBody(),
    this.getCreatedAt(),
    this.getStatus(),
    this.history
      .map((item) => (item as TicketHistoryItem).getDTO())
      .filter((itemDTO) => itemDTO.payload.skip !== undefined),
  );
};
