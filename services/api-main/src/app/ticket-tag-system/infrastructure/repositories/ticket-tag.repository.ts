import { IntlValue } from 'src/codebase/types/IntlValue';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { TicketTagDb } from '../schema/ticket-tag.schema';
import { TicketTag } from '../../domain/entities/ticket-tag.entity';

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

  async create({
    groupId,
    nameIntl,
    descriptionIntl,
  }: {
    groupId: string;
    nameIntl: IntlValue;
    descriptionIntl: IntlValue;
  }): Promise<TicketTag> {
    const obj = new this.ticketTagModel({
      group: groupId,
      nameIntl,
      descriptionIntl,
    });

    const newTicketTag = await obj.save();

    return this.mapper.map(newTicketTag, TicketTagDb, TicketTag);
  }

  async update(
    id: string,
    {
      nameIntl,
      descriptionIntl,
    }: { nameIntl: IntlValue; descriptionIntl: IntlValue },
  ) {
    const tag = await this.ticketTagModel.findOneAndUpdate(
      { _id: id },
      { nameIntl, descriptionIntl },
    );

    return this.mapper.map(tag, TicketTagDb, TicketTag);
  }
}
