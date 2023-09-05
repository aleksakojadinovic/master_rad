import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketDocument } from 'src/app/tickets/schema/ticket.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/app/users/users.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Injectable()
export class TicketsRepository {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    @InjectMapper() private readonly mapper: Mapper,
    private usersService: UsersService,
  ) {}

  private static POPULATE = [
    {
      path: 'createdBy',
      model: 'User',
      populate: { path: 'roles', model: 'Role' },
    },
    {
      path: 'history.initiator',
      model: 'User',
      populate: {
        path: 'roles',
        model: 'Role',
      },
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
      populate: {
        path: 'roles',
        model: 'Role',
      },
    },
  ];

  findById(id: string): Promise<TicketDocument> {
    return this.ticketModel
      .findOne({ _id: id })
      .populate(TicketsRepository.POPULATE);
  }

  findAll(
    page = 1,
    perPage = 10,
    status: string | null = null,
    assignee: string | null = null,
    createdBy: string | null = null,
  ): Promise<TicketDocument[]> {
    const query = this.ticketModel.find({});

    if (status !== null) {
      query.where('status', status);
    }

    if (assignee !== null) {
      query.where('assignees', { $in: [assignee] });
    }

    if (createdBy !== null) {
      query.where('createdBy', createdBy);
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
