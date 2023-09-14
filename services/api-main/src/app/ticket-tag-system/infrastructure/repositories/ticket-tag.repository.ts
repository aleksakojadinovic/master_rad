import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { TicketTagDb } from '../schema/ticket-tag.schema';
import { TicketTag } from '../../domain/entities/ticket-tag.entity';
import { TicketTagGroupDb } from '../schema/ticket-tag-group.schema';

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
      model: 'TicketTagGroupDb',
    },
  ];

  async findAll(): Promise<TicketTag[]> {
    const result = await this.ticketTagModel
      .find({})
      .populate(TicketTagRepository.POPULATE);

    return this.mapper.mapArray(result, TicketTagDb, TicketTag);
  }

  async findById(id: string): Promise<TicketTag | null> {
    const tag = await this.ticketTagModel.findById(id);

    if (!tag) {
      return null;
    }

    return this.mapper.map(tag, TicketTagDb, TicketTag);
  }

  async findByIds(ids: string[]): Promise<TicketTag[]> {
    const result = await this.ticketTagModel
      .find({ _id: { $in: ids } })
      .populate(TicketTagRepository.POPULATE);

    return this.mapper.mapArray(result, TicketTagDb, TicketTag);
  }

  async create(tag: TicketTag): Promise<TicketTag> {
    const document = new this.ticketTagModel();

    document.nameIntl = tag.nameIntl;
    document.descriptionIntl = tag.descriptionIntl;
    document.group = tag.group.id as unknown as TicketTagGroupDb;

    await document.save();
    await document.populate(TicketTagRepository.POPULATE);

    return this.mapper.map(document, TicketTagDb, TicketTag);
  }

  async update(tag: TicketTag) {
    const document = await this.ticketTagModel
      .findById(tag.id)
      .populate(TicketTagRepository.POPULATE);

    document.nameIntl = tag.nameIntl;
    document.descriptionIntl = tag.descriptionIntl;

    await document.save();

    return this.mapper.map(document, TicketTagDb, TicketTag);
  }
}
