import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/codebase/BaseService';
import { TicketTagDb } from '../../infrastructure/schema/ticket-tag.schema';
import { CreateTicketTagDTO } from '../../api/dto/create-ticket-tag.dto';
import { User } from '../../../users/infrastructure/schema/user.schema';
import { TicketTagRepository } from '../../infrastructure/repositories/ticket-tag.repository';

@Injectable()
export class TicketTagService extends BaseService {
  constructor(
    @InjectModel(TicketTagDb.name)
    private ticketTagModel: Model<TicketTagDb>,
    private ticketTagRepository: TicketTagRepository,
  ) {
    super();
  }

  async findAll(user: User) {
    const tags = await this.ticketTagRepository.findAll();
    const allowedTags = tags.filter((tag) => {
      const canSee = tag.group.permissions.canSeeRoles.includes(user.role);

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

  async findMany(ids: string[]) {
    return this.ticketTagRepository.findManyByIds(ids);
  }
}
