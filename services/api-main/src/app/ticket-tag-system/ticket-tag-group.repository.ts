import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import {
  TicketTagGroup,
  TicketTagGroupPermissions,
} from './schema/ticket-tag-group.schema';
import { IntlValue } from 'src/codebase/types/IntlValue';

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
  ];

  findOne(id: string) {
    return this.ticketTagGroupModel
      .findOne({ _id: id })
      .populate(TicketTagGroupRepository.POPULATE);
  }

  async doesAlreadyExist(nameIntl: IntlValue): Promise<boolean> {
    const intlKeys = Object.keys(nameIntl);
    const nameClashCondition = intlKeys.map((key) => ({
      [`nameIntl.${key}`]: nameIntl[key],
    }));
    const result = await this.ticketTagGroupModel.findOne({
      $or: nameClashCondition,
    });
    return !!result;
  }

  async findAllByRoles(roles: string[]): Promise<TicketTagGroup[]> {
    return this.ticketTagGroupModel
      .find({
        'permissions.canSeeRoles': { $in: roles },
      })
      .populate(TicketTagGroupRepository.POPULATE);
  }

  create({
    nameIntl,
    descriptionIntl,
    roles,
  }: {
    nameIntl: IntlValue;
    descriptionIntl: IntlValue;
    roles: string[];
  }) {
    const newGroup = new this.ticketTagGroupModel();
    newGroup.nameIntl = nameIntl;
    newGroup.descriptionIntl = descriptionIntl;
    newGroup.permissions = new TicketTagGroupPermissions(
      roles as any,
      roles as any,
      roles as any,
    );

    return newGroup.save();
  }
}
