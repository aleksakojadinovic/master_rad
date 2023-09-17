import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { BaseService } from 'src/codebase/BaseService';
import { TicketsRepository } from '../../infrastructure/tickets.repository';
import { TicketNotFoundError } from '../errors/TicketNotFound';
import { CommentNotFoundError } from '../errors/CommentNotFound';
import { CannotUpdateOthersCommentsError } from '../errors/CannotUpdateOthersComments';
import { User } from 'src/app/users/domain/entities/user.entity';
import { Ticket } from '../entities/ticket.entity';
import { TicketRedactionService } from './ticket-redacation.service';

@Injectable()
export class TicketCommentService extends BaseService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private ticketRedactionService: TicketRedactionService,
    private ticketsRepository: TicketsRepository,
  ) {
    super();
  }

  private async findAndProtect(
    ticketId: string,
    user: User,
    commentId: string,
  ) {
    const ticket = await this.ticketsRepository.findById(ticketId);

    if (!ticket) {
      throw new TicketNotFoundError(ticketId);
    }

    const isOwner = ticket.createdBy.id === user.id;

    if (user.isCustomer() && !isOwner) {
      throw new TicketNotFoundError(ticket.id);
    }

    const comment = ticket.comments.find((c) => c.commentId === commentId);

    if (!comment) {
      throw new CommentNotFoundError();
    }

    if (comment.user.id !== user.id) {
      throw new CannotUpdateOthersCommentsError();
    }

    return { comment, ticket };
  }

  async updateComment(id: string, user: User, commentId: string, body: string) {
    const { ticket, comment } = await this.findAndProtect(id, user, commentId);

    comment.body = body;

    const updatedTicket = await this.ticketsRepository.updateComment(
      ticket,
      comment,
      user,
    );

    this.ticketRedactionService.prepareTicketResponse(ticket, user);
    return updatedTicket;
  }

  async deleteComment(id: string, user: User, commentId: string) {
    const { ticket, comment } = await this.findAndProtect(id, user, commentId);

    const updatedTicket = await this.ticketsRepository.deleteComment(
      ticket,
      comment,
      user,
    );

    this.ticketRedactionService.prepareTicketResponse(updatedTicket, user);
    return updatedTicket;
  }
}
