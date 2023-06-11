import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/codebase/BaseService';
import { TicketTag } from './schema/ticket-tag.schema';
import { CreateTicketTagDto } from './dto/create-ticket-tag.dto';

@Injectable()
export class TicketTagService extends BaseService {
  constructor(
    @InjectModel(TicketTag.name)
    private ticketTagModel: Model<TicketTag>,
  ) {
    super();
  }

  async create(dto: CreateTicketTagDto) {
    const newTicketTag = new this.ticketTagModel({
      name: dto.name,
      description: dto.description,
      group: dto.groupId,
      nameIntlKey: `tag_${dto.groupName}_${dto.name}_Title`,
      descriptionIntlKey: `tag_${dto.groupName}_${dto.name}_Description`,
    });

    const tag = await newTicketTag.save();
    return tag;
  }
}
