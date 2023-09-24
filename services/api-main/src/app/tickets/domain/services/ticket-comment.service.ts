import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { BaseService } from 'src/codebase/BaseService';
import { TicketsRepository } from '../../infrastructure/tickets.repository';
import { TicketNotFoundError } from '../errors/TicketNotFound';
import { CommentNotFoundError } from '../errors/CommentNotFound';
import { CannotUpdateOthersCommentsError } from '../errors/CannotUpdateOthersComments';
import { User } from 'src/app/users/domain/entities/user.entity';
import { TicketRedactionService } from './ticket-redacation.service';
import { CannotChangeCommentsForTicketStatus } from '../errors/CannotChangeCommentsOfAClosedTicket';
import { AddCommentDTO } from '../../api/dto/add-comment.dto';
import { UpdateCommentDTO } from '../../api/dto/update-comment.dto';
import { CustomerCannotAddInternalCommmentError } from '../errors/CustomerCannotAddInternalComment';
import { NotificationFactory } from 'src/app/notifications/domain/factory/notification.factory';
import { v4 as uuid } from 'uuid';
import { NotificationsService } from 'src/app/notifications/domain/notifications.service';

@Injectable()
export class TicketCommentService extends BaseService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private ticketRedactionService: TicketRedactionService,
    private ticketsRepository: TicketsRepository,
    private notificationsService: NotificationsService,
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

    if (ticket.isFinalStatus()) {
      throw new CannotChangeCommentsForTicketStatus(ticket.status);
    }

    if (user.isCustomer() && !ticket.isOwner(user)) {
      throw new TicketNotFoundError(ticket.id);
    }

    const comment = ticket.comments.find((c) => c.commentId === commentId);

    if (!comment) {
      throw new CommentNotFoundError();
    }

    if (!comment.isOwner(user)) {
      throw new CannotUpdateOthersCommentsError();
    }

    return { comment, ticket };
  }

  async addComment(id: string, user: User, dto: AddCommentDTO) {
    const ticket = await this.ticketsRepository.findById(id);

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    if (ticket.isFinalStatus()) {
      throw new CannotChangeCommentsForTicketStatus(ticket.status);
    }

    if (user.isCustomer() && !ticket.isOwner(user)) {
      throw new TicketNotFoundError(ticket.id);
    }

    if (user.isCustomer() && dto.isInternal) {
      throw new CustomerCannotAddInternalCommmentError();
    }

    const usersToNotify: User[] = [];
    usersToNotify.push(
      ...ticket.assignees.filter((assignee) => assignee.id !== user.id),
    );

    if (!ticket.isOwner(user) && !dto.isInternal) {
      usersToNotify.push(ticket.createdBy);
    }

    console.log(usersToNotify.map((u) => u.fullName));

    const commentId = uuid();

    ticket.addComment(commentId, user, dto.body, dto.isInternal, new Date());

    const notifications = usersToNotify.map((userToNotify) => {
      return NotificationFactory.create((builder) =>
        builder
          .forUser(userToNotify)
          .hasPayload('comment_added', (commentBuilder) =>
            commentBuilder
              .atTicket(ticket)
              .byUser(user)
              .hasCommentId(commentId),
          ),
      );
    });

    const updatedTicketPromise = this.ticketsRepository.update(ticket, user);
    const notificationsPromise = this.notificationsService.emitNotifications(
      ...notifications,
    );

    const [updatedTicket] = await Promise.all([
      updatedTicketPromise,
      notificationsPromise,
    ]);

    this.ticketRedactionService.prepareTicketResponse(updatedTicket, user);

    return updatedTicket;
  }

  async updateComment(
    id: string,
    user: User,
    commentId: string,
    dto: UpdateCommentDTO,
  ) {
    const { ticket, comment } = await this.findAndProtect(id, user, commentId);

    comment.body = dto.body;

    const updatedTicket = await this.ticketsRepository.updateComment(
      ticket,
      comment,
      user,
    );

    this.ticketRedactionService.prepareTicketResponse(updatedTicket, user);
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
