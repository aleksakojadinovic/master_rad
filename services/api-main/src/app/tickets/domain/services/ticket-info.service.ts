import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/codebase/BaseService';
import { TicketsRepository } from '../../infrastructure/tickets.repository';
import { TicketNotFoundError } from '../errors/TicketNotFound';
import { User } from 'src/app/users/domain/entities/user.entity';
import { TicketRedactionService } from './ticket-redacation.service';
import { EditTitleDTO } from '../../api/dto/edit-title.dto';

@Injectable()
export class TicketInfoService extends BaseService {
  constructor(
    private ticketRedactionService: TicketRedactionService,
    private ticketsRepository: TicketsRepository,
  ) {
    super();
  }

  private async findAndProtect(ticketId: string, user: User) {
    const ticket = await this.ticketsRepository.findById(ticketId);

    if (!ticket) {
      throw new TicketNotFoundError(ticketId);
    }

    if (user.isCustomer() && !ticket.isOwner(user)) {
      throw new TicketNotFoundError(ticket.id);
    }

    return ticket;
  }

  async editTitle(id: string, user: User, dto: EditTitleDTO) {
    const ticket = await this.findAndProtect(id, user);

    ticket.title = dto.title;

    const newTicket = await this.ticketsRepository.update(ticket, user);
    this.ticketRedactionService.prepareTicketResponse(newTicket, user);

    return newTicket;
  }

  async editBody(id: string, user: User, dto: EditTitleDTO) {
    const ticket = await this.findAndProtect(id, user);

    ticket.body = dto.title;

    const newTicket = await this.ticketsRepository.update(ticket, user);
    this.ticketRedactionService.prepareTicketResponse(newTicket, user);

    return newTicket;
  }
}
