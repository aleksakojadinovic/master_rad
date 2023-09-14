import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { TicketTagGroupDb } from '../schema/ticket-tag-group.schema';
import { IntlValue } from 'src/codebase/types/IntlValue';
import { TicketTagGroup } from '../../domain/entities/ticket-tag-group.entity';
import { TicketTagDb } from '../schema/ticket-tag.schema';
import {
  CAN_ADD,
  CAN_REMOVE,
  CAN_SEE,
} from '../../domain/value-objects/ticket-tag-group-permissions';

export type UpdateTicketTagGroupCommand = {
  nameIntl: IntlValue;
  descriptionIntl: IntlValue;
};

@Injectable()
export class TicketTagGroupRepository {
  constructor(
    @InjectModel(TicketTagGroupDb.name)
    private ticketTagGroupModel: Model<TicketTagGroupDb>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private static POPULATE = [
    {
      path: 'tags',
      model: 'TicketTagDb',
    },
  ];

  async findOne(id: string): Promise<TicketTagGroup | null> {
    const result = await this.ticketTagGroupModel
      .findById(id)
      .populate(TicketTagGroupRepository.POPULATE);

    if (!result) {
      return null;
    }

    return this.mapper.map(result, TicketTagGroupDb, TicketTagGroup);
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
    const result = await this.ticketTagGroupModel
      .find({
        'permissions.canSeeRoles': { $in: roles },
      })
      .populate(TicketTagGroupRepository.POPULATE);

    return this.mapper.mapArray(result, TicketTagGroupDb, TicketTagGroup);
  }

  async create(group: TicketTagGroup) {
    const document = new this.ticketTagGroupModel();
    document.nameIntl = group.nameIntl;
    document.descriptionIntl = group.descriptionIntl;
    document.permissions = {
      canAddRoles: group.permissions[CAN_ADD],
      canRemoveRoles: group.permissions[CAN_REMOVE],
      canSeeRoles: group.permissions[CAN_SEE],
    };

    await document.save();
    await document.populate(TicketTagGroupRepository.POPULATE);

    return this.mapper.map(document, TicketTagGroupDb, TicketTagGroup);
  }

  // Let's go
  async update(group: TicketTagGroup): Promise<TicketTagGroup | null> {
    const groupDocument = await this.ticketTagGroupModel.findById(group.id);

    if (!groupDocument) {
      return null;
    }

    groupDocument.nameIntl = group.nameIntl;
    groupDocument.descriptionIntl = group.nameIntl;
    groupDocument.tags = group.tags.map(
      (tag) => tag.id as unknown as TicketTagDb,
    );
    groupDocument.permissions.canAddRoles = group.permissions[CAN_ADD];
    groupDocument.permissions.canRemoveRoles = group.permissions[CAN_REMOVE];
    groupDocument.permissions.canSeeRoles = group.permissions[CAN_SEE];

    const updatedGroup = await this.ticketTagGroupModel.findOneAndUpdate(
      { _id: group.id },
      groupDocument,
    );

    return this.mapper.map(updatedGroup, TicketTagGroupDb, TicketTagGroup);
  }
}
