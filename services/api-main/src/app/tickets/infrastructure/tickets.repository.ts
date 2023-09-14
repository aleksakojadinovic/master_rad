import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TicketDb } from 'src/app/tickets/infrastructure/schema/ticket.schema';
import { Model, SortOrder } from 'mongoose';
import { UsersService } from 'src/app/users/domain/users.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Ticket } from '../domain/entities/ticket.entity';
import { User } from 'src/app/users/domain/entities/user.entity';
import {
  TicketHistoryEntryAssigneesChanged,
  TicketHistoryEntryBodyChanged,
  TicketHistoryEntryCommentAdded,
  TicketHistoryEntryCreated,
  TicketHistoryEntryStatusChanged,
  TicketHistoryEntryTagsChanged,
  TicketHistoryEntryTitleChanged,
  TicketHistoryEntryType,
  TicketHistoryItem,
} from './schema/ticket-history.schema';
import { UserDb } from 'src/app/users/infrastructure/schema/user.schema';
import { TicketTagDb } from 'src/app/ticket-tag-system/infrastructure/schema/ticket-tag.schema';

export type TicketsQuery = {
  page: number | null;
  perPage: number | null;
  statuses: string[] | null;
  notStatuses: string[] | null;
  assignee: string | null;
  createdBy: string | null;
  unassigned: boolean | null;
  sortOrder: SortOrder;
  sortField: string | null;
};

@Injectable()
export class TicketsRepository {
  constructor(
    @InjectModel(TicketDb.name) private ticketModel: Model<TicketDb>,
    @InjectMapper() private readonly mapper: Mapper,
    private usersService: UsersService,
  ) {}

  private static POPULATE = [
    {
      path: 'createdBy',
      model: 'User',
    },
    {
      path: 'history.initiator',
      model: 'User',
    },
    {
      path: 'tags',
      model: 'TicketTag',
      populate: {
        path: 'group',
        model: 'TicketTagGroup',
      },
    },
    {
      path: 'assignees',
      model: 'User',
    },
  ];

  async findById(id: string): Promise<Ticket | null> {
    const result = await this.ticketModel
      .findOne({ _id: id })
      .populate(TicketsRepository.POPULATE);

    if (!result) {
      return null;
    }

    return this.mapper.map(result, TicketDb, Ticket);
  }

  async findAll({
    page = 1,
    perPage = 10,
    statuses = null,
    notStatuses = null,
    assignee = null,
    createdBy = null,
    unassigned = null,
    sortOrder = 1,
    sortField = null,
  }: TicketsQuery): Promise<Ticket[]> {
    const query = this.ticketModel.find({});

    if (statuses !== null) {
      query.where('status', { $in: statuses });
    }

    if (notStatuses !== null) {
      query.where('status', { $nin: notStatuses });
    }

    if (assignee !== null) {
      query.where('assignees', { $in: [assignee] });
    }

    if (createdBy !== null) {
      query.where('createdBy', createdBy);
    }

    if (unassigned !== null) {
      if (unassigned) {
        query.or([
          { assignees: { $size: 0 } },
          { assignees: { $exists: false } },
        ]);
      }
      if (!unassigned) {
        query.where('assignees', { $ne: [] });
      }
    }

    if (sortField !== null) {
      query.sort([[sortField, sortOrder as SortOrder]]);
    }

    query.skip((page - 1) * perPage).limit(perPage);
    query.populate(TicketsRepository.POPULATE);

    const result = await query.exec();

    return this.mapper.mapArray(result, TicketDb, Ticket);
  }

  async findMostRecentTicketByUserId(userId: string): Promise<Ticket | null> {
    const result = await this.ticketModel.findOne(
      { createdBy: userId },
      {},
      { sort: { createdAt: -1 } },
    );

    if (!result) {
      return null;
    }

    return this.mapper.map(result, TicketDb, Ticket);
  }

  async create(ticket: Ticket) {
    const document = new this.ticketModel();

    const initialItem = new TicketHistoryItem();
    initialItem.timestamp = ticket.createdAt;
    initialItem.initiator = ticket.createdBy.id as unknown as UserDb;
    initialItem.type = TicketHistoryEntryType.CREATED;
    initialItem.payload = new TicketHistoryEntryCreated(
      ticket.title,
      ticket.body,
      ticket.status,
    );

    await document.save();
    await document.populate(TicketsRepository.POPULATE);

    return this.mapper.map(document, TicketDb, Ticket);
  }

  async update(newTicket: Ticket, user: User): Promise<Ticket | null> {
    const document = await this.ticketModel
      .findById(newTicket.id)
      .populate(TicketsRepository.POPULATE);

    if (!document) {
      return null;
    }

    const timestamp = new Date();

    const ticket = this.mapper.map(document, TicketDb, Ticket);

    if (newTicket.title !== ticket.title) {
      const item = new TicketHistoryItem();
      item.initiator = user.id as unknown as UserDb;
      item.timestamp = timestamp;
      item.type = TicketHistoryEntryType.TITLE_CHANGED;
      item.payload = new TicketHistoryEntryTitleChanged(newTicket.title);
      document.history.push(item);
    }

    if (newTicket.body !== ticket.body) {
      const item = new TicketHistoryItem();
      item.initiator = user.id as unknown as UserDb;
      item.timestamp = timestamp;
      item.type = TicketHistoryEntryType.BODY_CHANGED;
      item.payload = new TicketHistoryEntryBodyChanged(newTicket.body);
      document.history.push(item);
    }

    const currentCommentsIds = ticket.comments.map(
      (comment) => comment.commentId,
    );

    const newComments = newTicket.comments.filter(
      (comment) => !currentCommentsIds.includes(comment.commentId),
    );

    newComments.forEach((comment) => {
      const item = new TicketHistoryItem();
      item.initiator = user.id as unknown as UserDb;
      item.timestamp = timestamp;
      item.type = TicketHistoryEntryType.COMMEND_ADDED;
      item.payload = new TicketHistoryEntryCommentAdded(
        comment.body,
        comment.commentId,
        comment.isInternal,
      );
      document.history.push(item);
    });

    const currentAssigneeIds = ticket.assignees.map((user) => user.id);
    currentAssigneeIds.sort();
    const newAssigneeIds = newTicket.assignees.map((user) => user.id);
    newAssigneeIds.sort();

    const isAssigneesChanged =
      currentAssigneeIds.length !== newAssigneeIds.length ||
      currentAssigneeIds.some((id, index) => id !== newAssigneeIds[index]);

    if (isAssigneesChanged) {
      const item = new TicketHistoryItem();
      item.initiator = user.id as unknown as UserDb;
      item.timestamp = timestamp;
      item.type = TicketHistoryEntryType.ASSIGNEES_CHANGED;
      item.payload = new TicketHistoryEntryAssigneesChanged(
        newTicket.assignees.map((user) => user.id as unknown as UserDb),
      );
      document.history.push(item);
    }

    if (ticket.status !== newTicket.status) {
      const item = new TicketHistoryItem();
      item.initiator = user.id as unknown as UserDb;
      item.timestamp = timestamp;
      item.type = TicketHistoryEntryType.STATUS_CHANGED;
      item.payload = new TicketHistoryEntryStatusChanged(newTicket.status);
      document.history.push(item);
    }

    const currentTagIds = ticket.tags.map((tag) => tag.id);
    currentTagIds.sort();
    const newTagIds = newTicket.tags.map((tag) => tag.id);
    newTagIds.sort();

    if (
      currentTagIds.length !== newTagIds.length ||
      currentTagIds.some((id, index) => id !== newTagIds[index])
    ) {
      const item = new TicketHistoryItem();
      item.initiator = user.id as unknown as UserDb;
      item.timestamp = timestamp;
      item.type = TicketHistoryEntryType.TAGS_CHANGED;
      item.payload = new TicketHistoryEntryTagsChanged(
        newTicket.tags.map((tag) => tag.id as unknown as TicketTagDb),
      );
      document.history.push(item);
    }

    await document.save();
    await document.populate(TicketsRepository.POPULATE);

    return this.mapper.map(document, TicketDb, Ticket);
  }
}