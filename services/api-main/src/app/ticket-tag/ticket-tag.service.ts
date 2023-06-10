import { RolesService } from './../users/roles.service';
import { CreateTicketTagGroupDTO } from './dto/create-ticket-tag-group.dto';
import { Injectable } from '@nestjs/common';
import { CreateTicketTagDto } from './dto/create-ticket-tag.dto';
import { UpdateTicketTagDto } from './dto/update-ticket-tag.dto';
import {
  TicketTagGroup,
  TicketTagGroupPermissions,
} from './schema/ticket-tag-group.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketTagGroupNotFoundError } from './errors/TicketTagGroupNotFound';
import { TicketTagNameAlreadyExistsError } from './errors/TicketTagNameAlreadyExists';

@Injectable()
export class TicketTagService {
  constructor(
    @InjectModel(TicketTagGroup.name)
    private ticketTagGroupModel: Model<TicketTagGroup>,
    private rolesService: RolesService,
  ) {}

  create(createTicketTagDto: CreateTicketTagDto) {
    return 'This action adds a new ticketTag';
  }

  async createGroup(dto: CreateTicketTagGroupDTO) {
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
    const group = await this.findOne(id);
    if (!group) {
      throw new TicketTagGroupNotFoundError();
    }
    const currentTagNames = group.tags.map(({ name }) => name);
    const requestedTagNames = tags.map(({ name }) => name);
    if (currentTagNames.some((name) => requestedTagNames.includes(name))) {
      throw new TicketTagNameAlreadyExistsError();
    }

    tags.forEach((tag) => group.tags.push(tag));

    await group.save();
    return group;
  }

  findAll() {
    return `This action returns all ticketTag`;
  }

  findOne(id: string) {
    return this.ticketTagGroupModel.findOne({ _id: id });
  }

  update(id: number, updateTicketTagDto: UpdateTicketTagDto) {
    return `This action updates a #${id} ticketTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticketTag`;
  }
}
