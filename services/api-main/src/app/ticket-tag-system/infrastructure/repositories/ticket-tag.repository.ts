import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { TicketTagDb, TicketTagDocument } from '../schema/ticket-tag.schema';

@Injectable()
export class TicketTagRepository {
  constructor(
    @InjectModel(TicketTagDb.name)
    private ticketTagModel: Model<TicketTagDb>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private static POPULATE = [
    {
      path: 'group',
      model: 'TicketTagGroup',
    },
  ];

  async findAll(): Promise<TicketTagDocument[]> {
    return this.ticketTagModel.find({}).populate(TicketTagRepository.POPULATE);
  }

  async findManyByIds(ids: string[]): Promise<TicketTagDocument[]> {
    return this.ticketTagModel
      .find({ _id: { $in: ids } })
      .populate(TicketTagRepository.POPULATE);
  }
}
