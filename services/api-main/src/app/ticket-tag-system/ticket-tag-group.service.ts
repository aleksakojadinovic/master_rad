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

@Injectable()
export class TicketTagGroupService extends BaseService {
  constructor(
    @InjectModel(TicketTagGroup.name)
    private ticketTagGroupModel: Model<TicketTagGroup>,
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
    ticketTagGroupObject.name = dto.name;
    ticketTagGroupObject.description = dto.description;
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

    return 'test';
  }

  async addTagsToGroup(id: string, tags: CreateTicketTagDto[]) {
    const group = await this.ticketTagGroupModel
      .findById(id)
      .populate({ path: 'tags', model: 'TicketTag' });

    if (!group) {
      throw new TicketTagGroupNotFoundError();
    }

    const currentTagNames = group.tags.map(({ name }) => name);
    const requestedTagNames = tags.map(({ name }) => name);
    if (currentTagNames.some((name) => requestedTagNames.includes(name))) {
      throw new TicketTagNameAlreadyExistsError();
    }

    const tagModels = await Promise.all(
      tags.map(async (tag) => {
        const model = this.ticketTagService.create(
          new CreateTicketTagDto(tag.name, tag.description, id),
        );
        return model;
      }),
    );

    tagModels.forEach((model) => group.tags.push(model));

    await group.save();
    return group;
  }

  async findAll(queryDTO: EntityQueryDTO) {
    const query = this.ticketTagGroupModel.find({});
    const populations = this.constructPopulate(queryDTO);
    populations.forEach((p) => query.populate(p));
    const groups = await query.exec();
    return groups;
  }

  findOne(id: string) {
    return this.ticketTagGroupModel.findOne({ _id: id });
  }

  update(id: number) {
    return `This action updates a #${id} ticketTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticketTag`;
  }
}