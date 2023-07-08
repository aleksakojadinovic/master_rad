import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/codebase/BaseService';
import { TicketTag } from './schema/ticket-tag.schema';
import { CreateTicketTagDTO } from './dto/create-ticket-tag.dto';

@Injectable()
export class TicketTagService extends BaseService {
  constructor(
    @InjectModel(TicketTag.name)
    private ticketTagModel: Model<TicketTag>,
  ) {
    super();
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
}
