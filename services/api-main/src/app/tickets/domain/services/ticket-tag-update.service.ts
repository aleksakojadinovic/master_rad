import { Injectable } from '@nestjs/common';
import { TicketsRepository } from '../../infrastructure/tickets.repository';
import { User } from 'src/app/users/domain/entities/user.entity';
import { AddTicketTagsDTO } from '../../api/dto/add-ticket-tags.dto';
import { TicketTagService } from 'src/app/ticket-tag-system/domain/services/ticket-tag.service';
import { NotAllowedToAddThisTagError } from '../errors/NotAllowedToAddThisTag';
import { NotAllowedToRemoveThisTagError } from '../errors/NotAllowedToRemoveThisTag';
import { RemoveTicketTagsDTO } from '../../api/dto/remove-ticket-tags.dto';
import { DuplicateTagError } from '../errors/DuplicateTag';
import { TicketNotFoundError } from '../errors/TicketNotFound';
import { TicketRedactionService } from './ticket-redacation.service';

@Injectable()
export class TicketTagUpdateService {
  constructor(
    private ticketsRepository: TicketsRepository,
    private ticketTagService: TicketTagService,
    private ticketRedactionService: TicketRedactionService,
  ) {}

  private async processData(user: User, tagIds: string[], adding: boolean) {
    const tags = await this.ticketTagService.findByIds(tagIds);

    const removing = !adding;

    const isForbidden = tags.some(
      (tag) =>
        (adding && !tag.group.canAdd(user)) ||
        (removing && !tag.group.canRemove(user)),
    );

    if (isForbidden) {
      if (adding) {
        throw new NotAllowedToAddThisTagError();
      }
      if (removing) {
        throw new NotAllowedToRemoveThisTagError();
      }
    }

    return tags;
  }

  public async addTags(ticketId: string, user: User, dto: AddTicketTagsDTO) {
    const [ticket, tags] = await Promise.all([
      this.ticketsRepository.findById(ticketId),
      this.processData(user, dto.tags, true),
    ]);

    if (!ticket) {
      throw new TicketNotFoundError(ticketId);
    }

    if (tags.length === 0) {
      return ticket;
    }

    if (tags.some((tag) => ticket.hasTag(tag))) {
      throw new DuplicateTagError();
    }

    ticket.addTags(tags);

    const updatedTicket = await this.ticketsRepository.update(ticket, user);
    this.ticketRedactionService.prepareTicketResponse(updatedTicket, user);
    return updatedTicket;
  }

  public async removeTags(
    ticketId: string,
    user: User,
    dto: RemoveTicketTagsDTO,
  ) {
    const [ticket, tags] = await Promise.all([
      this.ticketsRepository.findById(ticketId),
      this.processData(user, dto.tags, false),
    ]);

    if (!ticket) {
      throw new TicketNotFoundError(ticketId);
    }

    if (tags.length === 0) {
      return ticket;
    }

    ticket.removeTags(tags);

    const updatedTicket = await this.ticketsRepository.update(ticket, user);
    this.ticketRedactionService.prepareTicketResponse(updatedTicket, user);
    return updatedTicket;
  }
}
