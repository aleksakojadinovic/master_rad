import { CAN_SEE } from './../value-objects/ticket-tag-group-permissions';
import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/codebase/BaseService';
import { CreateOrUpdateTicketTagDTO } from '../../api/dto/create-ticket-tag.dto';
import { TicketTagRepository } from '../../infrastructure/repositories/ticket-tag.repository';
import { User } from 'src/app/users/domain/entities/user.entity';
import { TicketTag } from '../entities/ticket-tag.entity';
import { TicketTagGroup } from '../entities/ticket-tag-group.entity';

@Injectable()
export class TicketTagService extends BaseService {
  constructor(private ticketTagRepository: TicketTagRepository) {
    super();
  }

  async findAll(user: User) {
    const tags = await this.ticketTagRepository.findAll();

    const allowedTags = tags.filter((tag) => {
      const canSee = tag.group.permissions[CAN_SEE].includes(user.role);

      return canSee;
    });

    return allowedTags;
  }

  async findById(id: string) {
    const tag = await this.ticketTagRepository.findById(id);
    return tag;
  }

  async create(dto: CreateOrUpdateTicketTagDTO, group: TicketTagGroup) {
    const tag = new TicketTag();
    tag.nameIntl = dto.nameIntl;
    tag.descriptionIntl = dto.descriptionIntl;
    tag.group = group;

    const savedTag = await this.ticketTagRepository.create(tag);

    return savedTag;
  }

  async update(dto: CreateOrUpdateTicketTagDTO) {
    const tag = await this.ticketTagRepository.findById(dto.id);
    if (!tag) {
      return null;
    }

    tag.nameIntl = dto.nameIntl;
    tag.descriptionIntl = dto.descriptionIntl;

    const result = await this.ticketTagRepository.update(tag);
    return result;
  }

  async findByIds(ids: string[]) {
    return this.ticketTagRepository.findByIds(ids);
  }
}
