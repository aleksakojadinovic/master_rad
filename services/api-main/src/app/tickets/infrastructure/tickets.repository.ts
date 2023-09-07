import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  TicketDb,
  TicketDocument,
} from 'src/app/tickets/infrastructure/schema/ticket.schema';
import { Model, SortOrder } from 'mongoose';
import { UsersService } from 'src/app/users/users.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

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

  findById(id: string): Promise<TicketDocument> {
    return this.ticketModel
      .findOne({ _id: id })
      .populate(TicketsRepository.POPULATE);
  }

  findAll({
    page = 1,
    perPage = 10,
    statuses = null,
    notStatuses = null,
    assignee = null,
    createdBy = null,
    unassigned = null,
    sortOrder = 1,
    sortField = null,
  }: TicketsQuery): Promise<TicketDocument[]> {
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

    return query.exec();
  }

  async findMostRecentTicketByUserId(userId: string): Promise<TicketDocument> {
    return this.ticketModel.findOne(
      { createdBy: userId },
      {},
      { sort: { createdAt: -1 } },
    );
  }
}
