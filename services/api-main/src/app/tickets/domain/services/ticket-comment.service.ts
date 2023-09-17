import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { BaseService } from 'src/codebase/BaseService';
import { TicketsRepository } from '../../infrastructure/tickets.repository';
import { TicketNotFoundError } from '../errors/TicketNotFound';
import { CommentNotFoundError } from '../errors/CommentNotFound';
import { CannotUpdateOthersCommentsError } from '../errors/CannotUpdateOthersComments';
import { User } from 'src/app/users/domain/entities/user.entity';

@Injectable()
export class TicketsCommentService extends BaseService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private ticketsRepository: TicketsRepository,
  ) {
    super();
  }

  async updateComment(id: string, user: User, commentId: string, body: string) {
    const ticket = await this.ticketsRepository.findById(id);

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    const isOwner = ticket.createdBy.id === user.id;

    if (user.isCustomer() && !isOwner) {
      throw new TicketNotFoundError(id);
    }

    const comment = ticket.comments.find((c) => c.commentId === commentId);

    if (!comment) {
      throw new CommentNotFoundError();
    }

    if (comment.user.id !== user.id) {
      throw new CannotUpdateOthersCommentsError();
    }

    if (comment.body === body) {
      return ticket;
    }

    comment.body = body;

    const updatedTicket = await this.ticketsRepository.updateComment(
      ticket,
      comment,
      user,
    );

    return updatedTicket;
  }

  deleteComment(ticketId: string, user: User, commentId: string) {
    throw new Error('Method not implemented.');
  }
}
