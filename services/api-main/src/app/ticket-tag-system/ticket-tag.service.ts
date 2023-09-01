import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/codebase/BaseService';
import { TicketTag } from './schema/ticket-tag.schema';
import { CreateTicketTagDTO } from './dto/create-ticket-tag.dto';
import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';
import { User } from '../users/schema/user.schema';

@Injectable()
export class TicketTagService extends BaseService {
  constructor(
    @InjectModel(TicketTag.name)
    private ticketTagModel: Model<TicketTag>,
  ) {
    super();
  }

  constructPopulate(queryDTO: EntityQueryDTO): any[] {
    const populations = [];
    queryDTO.includes.forEach((includeField) => {
      if (includeField === 'group') {
        populations.push({
          path: 'group',
          model: 'TicketTagGroup',
        });
      }
    });
    return populations;
  }

  async findAll(queryDTO: EntityQueryDTO, user: User) {
    const userRoleIds = user.roles.map(({ _id }) => _id);
    const tags = await this.ticketTagModel.find({}).populate({
      path: 'group',
      model: 'TicketTagGroup',
    });

    const allowedTags = tags.filter((tag) => {
      const canSee = userRoleIds.some((userRoleId) =>
        tag.group.permissions.canSeeRoles
          .map(({ _id }) => _id.toString())
          .includes(userRoleId.toString()),
      );

      return canSee;
    });

    return allowedTags;
  }

  async findById(id: string) {
    const ticketTag = await this.ticketTagModel.findById(id);
    return ticketTag;
  }

  async create(dto: CreateTicketTagDTO, groupId: string) {
    const newTicketTag = new this.ticketTagModel({
      group: groupId,
      nameIntl: dto.nameIntl,
      descriptionIntl: dto.descriptionIntl,
    });

    const tag = await newTicketTag.save();
    return tag;
  }

  async update(dto: CreateTicketTagDTO) {
    const ticketTag = await this.findById(dto.id);
    ticketTag.nameIntl = dto.nameIntl;
    ticketTag.descriptionIntl = dto.descriptionIntl;

    await ticketTag.save();
    return ticketTag;
  }

  async findMany(ids: string[], queryDTO: EntityQueryDTO) {
    const query = this.ticketTagModel.find({ _id: { $in: ids } });
    const populations = this.constructPopulate(queryDTO);
    populations.forEach((p) => query.populate(p));
    const tags = await query.exec();
    return tags;
  }
}
