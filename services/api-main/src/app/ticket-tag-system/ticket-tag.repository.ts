import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { TicketTag, TicketTagDocument } from './schema/ticket-tag.schema';

@Injectable()
export class TicketTagRepository {
  constructor(
    @InjectModel(TicketTag.name)
    private ticketTagModel: Model<TicketTag>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private static POPULATE = [
    {
      path: 'group',
      model: 'TicketTagGroup',
    },
  ];

  async findAllByRoles(roles: string[]): Promise<TicketTagDocument[]> {
    return this.ticketTagModel
      .find({
        'group.permissions.canSeeRoles': { $in: roles },
      })
      .populate(TicketTagRepository.POPULATE);
  }
}
