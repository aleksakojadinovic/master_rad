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
import { TicketsRedactionService } from './ticket-redacation.service';

@Injectable()
export class TicketsCommentService extends BaseService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private ticketRedactionService: TicketsRedactionService,
    private ticketsRepository: TicketsRepository,
  ) {
    super();
  }

  private findAndProtectComment(ticket: Ticket, user: User, commentId: string) {
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

    return comment;
  }

  async updateComment(id: string, user: User, commentId: string, body: string) {
    const ticket = await this.ticketsRepository.findById(id);

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    const comment = this.findAndProtectComment(ticket, user, commentId);

    comment.body = body;

    const updatedTicket = await this.ticketsRepository.updateComment(
      ticket,
      comment,
      user,
    );

    this.ticketRedactionService.prepareTicketResponse(ticket, user);
    return updatedTicket;
  }

  deleteComment(ticketId: string, user: User, commentId: string) {
    throw new Error('Method not implemented.');
  }
}
