import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from '../../api/dto/create-ticket.dto';
import { UpdateTicketDto } from '../../api/dto/update-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TicketDb } from 'src/app/tickets/infrastructure/schema/ticket.schema';
import mongoose, { Model, isValidObjectId } from 'mongoose';
import { UsersService } from 'src/app/users/domain/users.service';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import {
  TicketHistoryEntryAssigneesAdded,
  TicketHistoryEntryBodyChanged,
  TicketHistoryEntryCommentAdded,
  TicketHistoryEntryCreated,
  TicketHistoryEntryStatusChange,
  TicketHistoryEntryTitleChanged,
  TicketHistoryItem,
} from '../../infrastructure/schema/ticket-history.schema';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { TicketHistoryEntryType } from '../../types';
import { TicketQueryDTO } from '../../api/dto/ticket-query.dto';
import { BaseService } from 'src/codebase/BaseService';
import { TicketNotFoundError } from '../errors/TicketNotFound';
import { TicketIdNotValidError } from '../errors/TicketIdNotValid';
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
import { NotificationDb } from '../../../notifications/infrastructure/schema/notification.schema';
import { NotificationsService } from '../../../notifications/domain/notifications.service';
import { TICKET_STATUS_GRAPH } from '../../infrastructure/schema/ticket-status.map';
import { NotAllowedToChangeToThisStatusError } from '../errors/NotAllowedToChangeToThisStatus';
import { TicketsRepository } from '../../infrastructure/tickets.repository';
import { CustomerCannotAddInternalCommmentError } from '../errors/CustomerCannotAddInternalComment';
import { BadTicketFiltersError } from '../errors/BadTicketFilters';
import { User } from '../../../users/domain/entities/user.entity';
import { Ticket } from '../entities/ticket.entity';
import { TicketStatus } from '../value-objects/ticket-status';

@Injectable()
export class TicketsService extends BaseService {
  constructor(
    @InjectModel(TicketDb.name) private ticketModel: Model<TicketDb>,
    @InjectMapper() private readonly mapper: Mapper,
    private ticketTagService: TicketTagService,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
    private ticketsRepository: TicketsRepository,
  ) {
    super();
  }

  async create(user: User, createTicketDto: CreateTicketDto) {
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
    // TODO apply builder pattern here.
    const ticketObject = new this.ticketModel();
    const groupId = uuid();
    const timestamp = new Date();

    const initialEntry = TicketHistoryItem.create({
      initiator: user,
      groupId,
      timestamp,
      entry: new TicketHistoryEntryCreated(),
    });

    const titleEntry = TicketHistoryItem.create({
      initiator: user,
      groupId,
      timestamp,
      entry: new TicketHistoryEntryTitleChanged(createTicketDto.title),
    });

    const bodyEntry = TicketHistoryItem.create({
      initiator: user,
      groupId,
      timestamp,
      entry: new TicketHistoryEntryBodyChanged(createTicketDto.body),
    });

    ticketObject.history = [initialEntry, titleEntry, bodyEntry];

    ticketObject.title = createTicketDto.title;
    ticketObject.body = createTicketDto.body;
    ticketObject.status = TicketStatus.NEW;
    ticketObject.createdBy = user;
    ticketObject.createdAt = timestamp;

    await ticketObject.save();

    return ticketObject;
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

    const isTicketOwner = ticket.createdBy._id.toString() === user.id;

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

    const creatorId = ticket.createdBy._id.toString();

    return user.id === creatorId.toString();
  }

  private prepareTicketResponse(ticket: Ticket, user: User): Ticket {
    this.stripInternalComments(ticket, user);
    this.stripTags(ticket, user);

    return ticket;
  }

  async update(id: string, user: User, dto: UpdateTicketDto) {
    if (!isValidObjectId(id)) {
      throw new TicketIdNotValidError(id);
    }

    const isCustomer = user.isCustomer();

    const ticket = await this.ticketsRepository.findById(id);

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    const isTicketOwner = ticket.createdBy._id.toString() === user.id;

    if (isCustomer && !isTicketOwner) {
      throw new TicketNotFoundError(id);
    }

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    const groupId = uuid();
    const timestamp = new Date();

    const notifications: NotificationDb[] = [];

    this.updateTicketStatus(ticket, user, dto, groupId, timestamp);
    this.updateTicketBody(ticket, user, dto, groupId, timestamp);
    const commentNotifications = this.updateTicketAddComment(
      ticket,
      user,
      dto,
      groupId,
      timestamp,
    );

    this.updateTicketTitle(ticket, user, dto, groupId, timestamp);

    const addAssigneeNotifications = await this.updateTicketAddAssignees(
      ticket,
      user,
      dto,
      groupId,
      timestamp,
    );

    this.updateTicketRemoveAssignees(ticket, dto);
    await this.updateTicketTags(ticket, user, dto);

    await ticket.save();

    if (commentNotifications) {
      notifications.push(...commentNotifications);
    }

    if (addAssigneeNotifications) {
      notifications.push(...addAssigneeNotifications);
    }

    await this.notificationsService.emitNotifications(...notifications);

    return this.prepareTicketResponse(ticket, user);
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }

  private stripTags(ticket: Ticket, user: User) {
    ticket.tags = ticket.tags.filter((tag) =>
      tag.group.permissions.canSeeRoles.includes(user.role),
    );
    return ticket;
  }

  private updateTicketStatus(
    ticket: Ticket,
    user: User,
    dto: UpdateTicketDto,
    groupId: any,
    timestamp: any,
  ) {
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

    const entry = new TicketHistoryEntryStatusChange(targetStatus);

    ticket.history.push(
      TicketHistoryItem.create({
        groupId,
        timestamp,
        initiator: user,
        entry,
      }),
    );

    ticket.status = targetStatus;
  }

  private updateTicketBody(
    ticket: Ticket,
    user: User,
    dto: UpdateTicketDto,
    groupId: string,
    timestamp: Date,
  ) {
    if (dto.body != null) {
      const entry = new TicketHistoryEntryBodyChanged(dto.body);
      ticket.history.push(
        TicketHistoryItem.create({
          groupId,
          timestamp,
          initiator: user,
          entry,
        }),
      );
      ticket.body = dto.body;
    }
  }

  private updateTicketTitle(
    ticket: Ticket,
    user: User,
    dto: UpdateTicketDto,
    groupId: string,
    timestamp: Date,
  ) {
    if (dto.title != null) {
      const entry = new TicketHistoryEntryTitleChanged(dto.title);
      ticket.history.push(
        TicketHistoryItem.create({
          groupId,
          timestamp,
          initiator: user,
          entry,
        }),
      );
      ticket.title = dto.title;
    }
  }

  private updateTicketAddComment(
    ticket: Ticket,
    user: User,
    dto: UpdateTicketDto,
    groupId: string,
    timestamp: Date,
  ): NotificationDb[] | null {
    if (dto.comment == null || dto.comment.length === 0) {
      return null;
    }

    if (user.isCustomer() && dto.isCommentInternal) {
      throw new CustomerCannotAddInternalCommmentError();
    }

    const entry = new TicketHistoryEntryCommentAdded(
      dto.comment,
      new mongoose.Types.ObjectId().toString(),
      dto.isCommentInternal,
    );

    ticket.history.push(
      TicketHistoryItem.create({
        groupId,
        timestamp,
        initiator: user,
        entry,
      }),
    );

    const usersToNotify: User[] = [];
    usersToNotify.push(
      ...ticket.assignees.filter(
        (assignee) => assignee._id.toString() !== user.id,
      ),
    );

    // First condition prevents self-notifications
    // Second condition prevents notifying customers of internal comments
    if (user.id !== ticket.createdBy._id.toString() && !dto.isCommentInternal) {
      usersToNotify.push(ticket.createdBy);
    }

    const notifications = usersToNotify.map((userToNotify) => {
      return NotificationFactory.create((builder) =>
        builder
          .forUser(userToNotify)
          .hasPayload('comment_added', (commentBuilder) =>
            commentBuilder
              .atTicket(ticket)
              .byUser(user)
              .hasCommentId(entry.commentId),
          ),
      );
    });

    return notifications;
  }

  private async updateTicketAddAssignees(
    ticket: Ticket,
    user: User,
    dto: UpdateTicketDto,
    groupId: string,
    timestamp: Date,
  ): Promise<NotificationDb[] | null> {
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
    const entry = new TicketHistoryEntryAssigneesAdded(dto.addAssignees);

    ticket.history.push(
      TicketHistoryItem.create({
        groupId,
        timestamp,
        initiator: user,
        entry,
      }),
    );
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
        if (!tag.group.permissions.canRemoveRoles.includes(user.role)) {
          throw new NotAllowedToRemoveThisTagError();
        }
      });
      ticket.tags = ticket.tags.filter(
        (tag) => !removeTags.includes(tag._id.toString()),
      );
    }

    if (addTags.length > 0) {
      const tagsToAdd = await this.ticketTagService.findByIds(addTags);
      tagsToAdd.forEach((tag) => {
        if (!tag.group.permissions.canAddRoles.includes(user.role)) {
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
    ticket.history = ticket.history.filter((item) => {
      if (item.entryType !== TicketHistoryEntryType.COMMEND_ADDED) {
        return true;
      }

      if ((item.entry as TicketHistoryEntryCommentAdded).isInternal) {
        return false;
      }
      return true;
    });
  }
}
