import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TicketDb } from 'src/app/tickets/infrastructure/schema/ticket.schema';
import { Model, SortOrder } from 'mongoose';
import { UsersService } from 'src/app/users/domain/users.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Ticket } from '../domain/entities/ticket.entity';

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
}
