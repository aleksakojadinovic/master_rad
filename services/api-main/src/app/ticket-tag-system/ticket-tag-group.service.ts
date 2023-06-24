import { RolesService } from '../users/roles.service';
import { CreateTicketTagGroupDTO } from './dto/create-ticket-tag-group.dto';
import { Injectable } from '@nestjs/common';
import { CreateTicketTagDto } from './dto/create-ticket-tag.dto';
import {
  TicketTagGroup,
  TicketTagGroupPermissions,
} from './schema/ticket-tag-group.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketTagGroupNotFoundError } from './errors/TicketTagGroupNotFound';
import { TicketTagNameAlreadyExistsError } from './errors/TicketTagNameAlreadyExists';
import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';
import { BaseService } from 'src/codebase/BaseService';
import { TicketTagService } from './ticket-tag.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { TicketTagGroupDTO } from './dto/ticket-tag-group.dto';
import {
  createTicketTagGroupDescriptionIntlKey,
  createTicketTagGroupNameIntlKey,
} from './utils';

@Injectable()
export class TicketTagGroupService extends BaseService {
  constructor(
    @InjectModel(TicketTagGroup.name)
    private ticketTagGroupModel: Model<TicketTagGroup>,
    @InjectMapper() private readonly mapper: Mapper,
    private rolesService: RolesService,
    private ticketTagService: TicketTagService,
  ) {
    super();
  }

  override constructPopulate(queryDTO: EntityQueryDTO): any[] {
    const populations = [];
    queryDTO.includes.forEach((includeField) => {
      if (includeField === 'role') {
        populations.push({
          path: 'permissions.canAddRoles',
          model: 'Role',
        });
        populations.push({
          path: 'permissions.canRemoveRoles',
          model: 'Role',
        });
      }
      if (includeField === 'tags') {
        populations.push({
          path: 'tags',
          model: 'TicketTag',
        });
      }
    });
    return populations;
  }

  async create(dto: CreateTicketTagGroupDTO) {
    const ticketTagGroupObject = new TicketTagGroup();
    ticketTagGroupObject.nameIntl = dto.nameIntl;
    ticketTagGroupObject.descriptionIntl = dto.descriptionIntl;
    ticketTagGroupObject.exclusive = dto.exclusive;
    // TODO: err handling of this service
    const resolvedCanAddRoles = await this.rolesService.findMany(
      dto.canAddRoles,
    );
    const resolvedCanRemoveRoles = await this.rolesService.findMany(
      dto.canRemoveRoles,
    );

    // TODO: Thissss maybe shouldnt be a class but a plain type D:
    const permissions = new TicketTagGroupPermissions(
      dto.canCreatorAdd,
      dto.canCreatorRemove,
      resolvedCanAddRoles,
      resolvedCanRemoveRoles,
    );

    ticketTagGroupObject.permissions = permissions;

    const model = new this.ticketTagGroupModel(ticketTagGroupObject);
    await model.save();

    return model;
  }

  async addTagsToGroup(id: string, tags: CreateTicketTagDto[]) {
    const group = await this.ticketTagGroupModel
      .findById(id)
      .populate({ path: 'tags', model: 'TicketTag' });

    if (!group) {
      throw new TicketTagGroupNotFoundError();
    }

    // const currentTagIntlKeys = group.tags.map(({ nameIntlKey }) => nameIntlKey);
    // const requestedTagIntlKeys = tags.map(({ name }) => name);
    // if (
    //   currentTagIntlKeys.some((name) => requestedTagIntlKeys.includes(name))
    // ) {
    //   throw new TicketTagNameAlreadyExistsError();
    // }

    const tagModels = await Promise.all(
      tags.map(async (tag) => {
        const model = this.ticketTagService.create(
          new CreateTicketTagDto(tag.nameIntl, tag.descriptionIntl, id),
        );
        return model;
      }),
    );

    tagModels.forEach((model) => group.tags.push(model));

    await group.save();
    return this.mapper.map(group, TicketTagGroup, TicketTagGroupDTO);
  }

  async findAll(queryDTO: EntityQueryDTO) {
    const query = this.ticketTagGroupModel.find({});
    const populations = this.constructPopulate(queryDTO);
    populations.forEach((p) => query.populate(p));
    const groups = await query.exec();
    return groups;
  }

  async findOne(id: string, queryDTO: EntityQueryDTO) {
    const query = this.ticketTagGroupModel.findOne({ _id: id });
    const populatinos = this.constructPopulate(queryDTO);
    populatinos.forEach((p) => query.populate(p));
    const group = await query.exec();
    if (!group) {
      throw new TicketTagGroupNotFoundError();
    }
    return group;
  }

  update(id: number) {
    return `This action updates a #${id} ticketTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticketTag`;
  }
}
