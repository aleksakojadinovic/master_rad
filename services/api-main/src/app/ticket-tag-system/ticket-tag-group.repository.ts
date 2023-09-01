import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { TicketTagGroup } from './schema/ticket-tag-group.schema';

@Injectable()
export class TicketTagGroupRepository {
  constructor(
    @InjectModel(TicketTagGroup.name)
    private ticketTagGroupModel: Model<TicketTagGroup>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private static POPULATE = [
    {
      path: 'tags',
      model: 'TicketTag',
    },
    {
      path: 'permissions.canAddRoles',
      model: 'Role',
    },
    {
      path: 'permissions.canRemoveRoles',
      model: 'Role',
    },
    {
      path: 'permissions.canSeeRoles',
      model: 'Role',
    },
  ];

  findOne(id: string) {
    return this.ticketTagGroupModel
      .findOne({ _id: id })
      .populate(TicketTagGroupRepository.POPULATE);
  }

  //   findAll(page = 1, perPage = 10, status: string | null = null) {
  //     const query = this.ticketTagGroupModel.find({});

  //     if (status !== null) {
  //       query.where('status', status);
  //     }

  //     query.skip((page - 1) * perPage).limit(perPage);
  //     query.populate(TicketTagGroupRepository.POPULATE);

  //     return query.exec();
  //   }
}
