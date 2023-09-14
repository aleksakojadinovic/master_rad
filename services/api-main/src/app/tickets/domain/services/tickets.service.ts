import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from '../../api/dto/create-ticket.dto';
import { UpdateTicketDto } from '../../api/dto/update-ticket.dto';
import { UsersService } from 'src/app/users/domain/users.service';
import * as moment from 'moment';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { TicketQueryDTO } from '../../api/dto/ticket-query.dto';
import { BaseService } from 'src/codebase/BaseService';
import { TicketNotFoundError } from '../errors/TicketNotFound';
import { CannotAssignCustomerError } from '../errors/CannotAssignCustomer';
import { TicketTagService } from '../../../ticket-tag-system/domain/services/ticket-tag.service';
import { OverlapInTagIdsError } from '../errors/OverlapInTagIds';
import { NotAllowedToAddThisTagError } from '../errors/NotAllowedToAddThisTag';
import { NotAllowedToRemoveThisTagError } from '../errors/NotAllowedToRemoveThisTag';
import { DuplicateTagError } from '../errors/DuplicateTag';
import { AssigneeNotFoundError } from '../errors/AssigneeNotFound';
import { DuplicateAssigneeError } from '../errors/DuplicateAssignee';
import { TooSoonToCreateAnotherTicketError } from '../errors/TooSoonToCreateAnotherTicket';
import { NotificationFactory } from '../../../notifications/domain/factory/notification.factory';
import { NotificationsService } from '../../../notifications/domain/notifications.service';
import { TICKET_STATUS_GRAPH } from '../value-objects/ticket-status.map';
import { NotAllowedToChangeToThisStatusError } from '../errors/NotAllowedToChangeToThisStatus';
import { TicketsRepository } from '../../infrastructure/tickets.repository';
import { CustomerCannotAddInternalCommmentError } from '../errors/CustomerCannotAddInternalComment';
import { BadTicketFiltersError } from '../errors/BadTicketFilters';
import { User } from '../../../users/domain/entities/user.entity';
import { Ticket } from '../entities/ticket.entity';
import { TicketStatus } from '../value-objects/ticket-status';
import { TicketComment } from '../value-objects/ticket-comment';
import { Notification } from 'src/app/notifications/domain/entities/notification.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TicketsService extends BaseService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private ticketTagService: TicketTagService,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
    private ticketsRepository: TicketsRepository,
  ) {
    super();
  }

  async create(user: User, dto: CreateTicketDto) {
    const mostRecentTicket =
      await this.ticketsRepository.findMostRecentTicketByUserId(
        user.id.toString(),
      );
    if (mostRecentTicket) {
      const createdAt = moment(mostRecentTicket.createdAt);
      const now = moment();

      const diffMinutes = now.diff(createdAt, 'minutes');

      if (diffMinutes <= 10) {
        throw new TooSoonToCreateAnotherTicketError(
          diffMinutes,
          10 - diffMinutes,
        );
      }
    }

    const ticket = new Ticket();
    ticket.title = dto.title;
    ticket.body = dto.body;
    ticket.status = TicketStatus.NEW;
    ticket.createdBy = user;
    ticket.createdAt = new Date();

    const savedTicket = await this.ticketsRepository.create(ticket);

    return savedTicket;
  }

  async findAll(user: User, queryDTO: TicketQueryDTO) {
    if (queryDTO.assignee !== null && queryDTO.unassigned !== null) {
      throw new BadTicketFiltersError(
        'Cannot query both unassigned and assigned tickets.',
      );
    }

    const {
      page,
      perPage,
      statuses,
      notStatuses,
      assignee,
      createdBy,
      unassigned,
      sortOrder,
      sortField,
    } = queryDTO;

    const tickets = await this.ticketsRepository.findAll({
      page,
      perPage,
      statuses,
      notStatuses,
      assignee,
      createdBy,
      unassigned,
      sortOrder,
      sortField,
    });

    return tickets.map((ticket) => this.stripTags(ticket, user));
  }

  async findOne(id: string, user: User) {
    const ticket = await this.ticketsRepository.findById(id);

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    const isTicketOwner = ticket.createdBy.id === user.id;

    if (user.isCustomer() && !isTicketOwner) {
      throw new TicketNotFoundError(id);
    }

    return this.prepareTicketResponse(ticket, user);
  }

  async isTicketOwner(user: User, ticketId: string) {
    let ticket: Ticket;
    try {
      ticket = await this.findOne(ticketId, user);
    } catch (e) {
      throw e;
    }

    const creatorId = ticket.createdBy.id.toString();

    return user.id === creatorId.toString();
  }

  private prepareTicketResponse(ticket: Ticket, user: User): Ticket {
    this.stripTags(ticket, user);
    this.stripInternalComments(ticket, user);

    return ticket;
  }

  async update(id: string, user: User, dto: UpdateTicketDto) {
    const isCustomer = user.isCustomer();

    const ticket = await this.ticketsRepository.findById(id);

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    const isTicketOwner = ticket.createdBy.id === id;

    if (isCustomer && !isTicketOwner) {
      throw new TicketNotFoundError(id);
    }

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    const notifications: Notification[] = [];

    this.updateTicketStatus(ticket, user, dto);
    this.updateTicketBody(ticket, dto);
    const commentNotifications = this.updateTicketAddComment(ticket, user, dto);

    this.updateTicketTitle(ticket, dto);

    const addAssigneeNotifications = await this.updateTicketAddAssignees(
      ticket,
      user,
      dto,
    );

    this.updateTicketRemoveAssignees(ticket, dto);
    await this.updateTicketTags(ticket, user, dto);

    if (commentNotifications) {
      notifications.push(...commentNotifications);
    }

    if (addAssigneeNotifications) {
      notifications.push(...addAssigneeNotifications);
    }

    const updatedTicket = await this.ticketsRepository.update(ticket, user);
    await this.notificationsService.emitNotifications(...notifications);

    return this.prepareTicketResponse(updatedTicket, user);
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }

  private stripTags(ticket: Ticket, user: User) {
    ticket.tags = ticket.tags.filter((tag) => tag.group.canSee(user));
    return ticket;
  }

  private updateTicketStatus(ticket: Ticket, user: User, dto: UpdateTicketDto) {
    if (!dto.status) {
      return;
    }

    const currentStatus = ticket.status;
    const targetStatus = dto.status;

    const canChange = TICKET_STATUS_GRAPH[currentStatus].find(
      (entry) =>
        entry.status === targetStatus && entry.roles.includes(user.role),
    );

    if (!canChange) {
      throw new NotAllowedToChangeToThisStatusError(
        currentStatus.toString(),
        targetStatus.toString(),
      );
    }

    ticket.status = targetStatus;
  }

  private updateTicketBody(ticket: Ticket, dto: UpdateTicketDto) {
    if (dto.body != null) {
      ticket.body = dto.body;
    }
  }

  private updateTicketTitle(ticket: Ticket, dto: UpdateTicketDto) {
    if (dto.title != null) {
      ticket.title = dto.title;
    }
  }

  private updateTicketAddComment(
    ticket: Ticket,
    user: User,
    dto: UpdateTicketDto,
  ): Notification[] | null {
    if (dto.comment == null || dto.comment.length === 0) {
      return null;
    }

    if (user.isCustomer() && dto.isCommentInternal) {
      throw new CustomerCannotAddInternalCommmentError();
    }

    const usersToNotify: User[] = [];
    usersToNotify.push(
      ...ticket.assignees.filter((assignee) => assignee.id !== user.id),
    );

    // First condition prevents self-notifications
    // Second condition prevents notifying customers of internal comments
    if (user.id !== ticket.createdBy.id && !dto.isCommentInternal) {
      usersToNotify.push(ticket.createdBy);
    }

    const comment = new TicketComment();
    comment.commentId = uuid();
    comment.body = dto.comment;
    comment.isInternal = dto.isCommentInternal;
    comment.timestamp = new Date();
    comment.user = user;

    ticket.comments.push(comment);

    const notifications = usersToNotify.map((userToNotify) => {
      return NotificationFactory.create((builder) =>
        builder
          .forUser(userToNotify)
          .hasPayload('comment_added', (commentBuilder) =>
            commentBuilder
              .atTicket(ticket)
              .byUser(user)
              .hasCommentId(comment.commentId),
          ),
      );
    });

    return notifications;
  }

  private async updateTicketAddAssignees(
    ticket: Ticket,
    user: User,
    dto: UpdateTicketDto,
  ): Promise<Notification[] | null> {
    if (dto.addAssignees == null || dto.addAssignees.length == 0) {
      return null;
    }
    const assignees: User[] = [];
    for (const assigneeId of dto.addAssignees) {
      const assigneeUser = await this.usersService.findOne(assigneeId);
      if (!assigneeUser) {
        throw new AssigneeNotFoundError();
      }
      if (assigneeUser.isCustomer()) {
        throw new CannotAssignCustomerError(assigneeId);
      }
      if (ticket.assignees.map((user) => user.id).includes(assigneeId)) {
        throw new DuplicateAssigneeError(assigneeId);
      }
      assignees.push(assigneeUser);
    }

    for (const a of assignees) {
      ticket.assignees.push(a);
    }

    const usersToNotify = assignees.filter(
      (assignee) => assignee.id !== user.id,
    );

    if (usersToNotify.length == 0) {
      return null;
    }

    const notifications = usersToNotify.map((userToNotify) =>
      NotificationFactory.create((builder) =>
        builder
          .forUser(userToNotify)
          .hasPayload('assigned', (assignBuilder) =>
            assignBuilder.atTicket(ticket).byUser(user),
          ),
      ),
    );

    return notifications;
  }

  private async updateTicketRemoveAssignees(
    ticket: Ticket,
    dto: UpdateTicketDto,
  ) {
    if (dto.removeAssignees && dto.removeAssignees.length > 0) {
      ticket.assignees = ticket.assignees.filter(
        (user) => !dto.removeAssignees.includes(user.id),
      );
    }
  }

  private async updateTicketTags(
    ticket: Ticket,
    user: User,
    dto: UpdateTicketDto,
  ) {
    const addTags = dto.addTags || [];
    const removeTags = dto.removeTags || [];

    if (addTags.some((addId) => removeTags.includes(addId))) {
      throw new OverlapInTagIdsError();
    }

    if (removeTags.length > 0) {
      const tagsToRemove = await this.ticketTagService.findByIds(removeTags);
      tagsToRemove.forEach((tag) => {
        if (!tag.group.canRemove(user)) {
          throw new NotAllowedToRemoveThisTagError();
        }
      });
      ticket.tags = ticket.tags.filter((tag) => !removeTags.includes(tag.id));
    }

    if (addTags.length > 0) {
      const tagsToAdd = await this.ticketTagService.findByIds(addTags);
      tagsToAdd.forEach((tag) => {
        if (!tag.group.canAdd(user)) {
          throw new NotAllowedToAddThisTagError();
        }

        if (
          ticket.tags.find((currentTagId) => {
            return currentTagId.toString() === tag.id;
          })
        ) {
          throw new DuplicateTagError();
        }
        ticket.tags.push(tag);
      });
    }
  }

  private stripInternalComments(ticket: Ticket, user: User) {
    if (!user.isCustomer()) {
      return;
    }
    ticket.comments = ticket.comments.filter((comment) => !comment.isInternal);
  }
}
