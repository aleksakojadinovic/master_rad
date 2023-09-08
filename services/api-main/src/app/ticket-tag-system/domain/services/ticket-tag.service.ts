import { CAN_SEE } from './../value-objects/ticket-tag-group-permissions';
import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/codebase/BaseService';
import { CreateTicketTagDTO } from '../../api/dto/create-ticket-tag.dto';
import { TicketTagRepository } from '../../infrastructure/repositories/ticket-tag.repository';
import { User } from 'src/app/users/domain/entities/user.entity';

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

  async create(dto: CreateTicketTagDTO, groupId: string) {
    const tag = await this.ticketTagRepository.create({
      groupId,
      nameIntl: dto.nameIntl,
      descriptionIntl: dto.descriptionIntl,
    });

    return tag;
  }

  async update(dto: CreateTicketTagDTO) {
    const result = await this.ticketTagRepository.update(dto.id, {
      nameIntl: dto.nameIntl,
      descriptionIntl: dto.descriptionIntl,
    });
    return result;
  }

  async findByIds(ids: string[]) {
    return this.ticketTagRepository.findByIds(ids);
  }
}
