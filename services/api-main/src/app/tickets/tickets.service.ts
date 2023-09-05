import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketDocument } from 'src/app/tickets/schema/ticket.schema';
import mongoose, { Model, isValidObjectId } from 'mongoose';
import { UsersService } from 'src/app/users/users.service';
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
} from './schema/ticket-history.schema';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { TicketHistoryEntryType, TicketStatus } from './types';
import { User } from 'src/app/users/schema/user.schema';
import { TicketQueryDTO } from './dto/ticket-query.dto';
import { BaseService } from 'src/codebase/BaseService';
import { TicketNotFoundError } from './errors/TicketNotFound';
import { TicketIdNotValidError } from './errors/TicketIdNotValid';
import { CannotAssignCustomerError } from './errors/CannotAssignCustomer';
import { TicketTagService } from '../ticket-tag-system/ticket-tag.service';
import { OverlapInTagIdsError } from './errors/OverlapInTagIds';
import { NotAllowedToAddThisTagError } from './errors/NotAllowedToAddThisTag';
import { NotAllowedToRemoveThisTagError } from './errors/NotAllowedToRemoveThisTag';
import { DuplicateTagError } from './errors/DuplicateTag';
import { AssigneeNotFoundError } from './errors/AssigneeNotFound';
import { DuplicateAssigneeError } from './errors/DuplicateAssignee';
import { TooSoonToCreateAnotherTicketError } from './errors/TooSoonToCreateAnotherTicket';
import { NotificationFactory } from '../notifications/factory/notification.factory';
import { Notification } from '../notifications/schema/notification.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { TICKET_STATUS_GRAPH } from './schema/ticket-status.map';
import { NotAllowedToChangeToThisStatusError } from './errors/NotAllowedToChangeToThisStatus';
import { TicketsRepository } from './tickets.repository';
import { CustomerCannotAddInternalCommmentError } from './errors/CustomerCannotAddInternalComment';

@Injectable()
export class TicketsService extends BaseService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
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
        user._id.toString(),
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
    const tickets = await this.ticketsRepository.findAll(
      queryDTO.page,
      queryDTO.perPage,
      queryDTO.status,
      queryDTO.assignee,
    );
    return tickets.map((ticket) => this.stripTags(ticket, user));
  }

  async findOne(id: string, user: User) {
    const ticket = await this.ticketsRepository.findById(id);

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }
    const isTicketOwner =
      ticket.createdBy._id.toString() === user._id.toString();

    if (user.isCustomer() && !isTicketOwner) {
      throw new TicketNotFoundError(id);
    }

    return this.prepareTicketResponse(ticket, user);

    // return this.prepareTicketResponse(ticket, user);
  }

  async isTicketOwner(user: User, ticketId: string) {
    let ticket: Ticket;
    try {
      ticket = await this.findOne(ticketId, user);
    } catch (e) {
      throw e;
    }

    const creatorId = ticket.createdBy._id.toString();

    return user._id.toString() === creatorId.toString();
  }

  private prepareTicketResponse(
    ticket: TicketDocument,
    user: User,
  ): TicketDocument {
    this.stripInternalComments(ticket, user);
    this.stripTags(ticket, user);

    return ticket;
  }

  async update(id: string, user: User, dto: UpdateTicketDto) {
    if (!isValidObjectId(id)) {
      throw new TicketIdNotValidError(id);
    }

    const isCustomer = user.roles.map(({ name }) => name).includes('customer');

    const ticket = await this.ticketsRepository.findById(id);

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    const isTicketOwner =
      ticket.createdBy._id.toString() === user._id.toString();

    if (isCustomer && !isTicketOwner) {
      throw new TicketNotFoundError(id);
    }

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    const groupId = uuid();
    const timestamp = new Date();

    const notifications: Notification[] = [];

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
    const userRoleIds = user.roles.map((role) => role._id.toString());
    ticket.tags = ticket.tags.filter((tag) => {
      const canSee = userRoleIds.some((userRoleId) =>
        tag.group.permissions.canSeeRoles
          .map(({ _id }) => _id.toString())
          .includes(userRoleId.toString()),
      );

      return canSee;
    });
    return ticket;
  }

  private updateTicketStatus(
    ticket: TicketDocument,
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

    // TODO: Imma refactor so that you can only have one role
    const role = user.roles[0].name;

    const canChange = TICKET_STATUS_GRAPH[currentStatus].find((entry) => {
      return entry.status === targetStatus && entry.roles.includes(role);
    });

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
    ticket: TicketDocument,
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
    ticket: TicketDocument,
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
    ticket: TicketDocument,
    user: User,
    dto: UpdateTicketDto,
    groupId: string,
    timestamp: Date,
  ): Notification[] | null {
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
        (assignee) => assignee._id.toString() !== user._id.toString(),
      ),
    );

    // First condition prevents self-notifications
    // Second condition prevents notifying customers of internal comments
    if (
      user._id.toString() !== ticket.createdBy._id.toString() &&
      !dto.isCommentInternal
    ) {
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
    ticket: TicketDocument,
    user: User,
    dto: UpdateTicketDto,
    groupId: string,
    timestamp: Date,
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
      if (assigneeUser.hasRole('customer')) {
        throw new CannotAssignCustomerError(assigneeId);
      }
      if (
        ticket.assignees.map((user) => user._id.toString()).includes(assigneeId)
      ) {
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
      (assignee) => assignee._id.toString() !== user._id.toString(),
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
    ticket: TicketDocument,
    dto: UpdateTicketDto,
  ) {
    if (dto.removeAssignees && dto.removeAssignees.length > 0) {
      ticket.assignees = ticket.assignees.filter(
        (user) => !dto.removeAssignees.includes(user._id.toString()),
      );
    }
  }

  private async updateTicketTags(
    ticket: TicketDocument,
    user: User,
    dto: UpdateTicketDto,
  ) {
    const addTags = dto.addTags || [];
    const removeTags = dto.removeTags || [];
    const userRoleIds = user.roles.map((role) => role._id.toString());

    if (addTags.some((addId) => removeTags.includes(addId))) {
      throw new OverlapInTagIdsError();
    }

    if (removeTags.length > 0) {
      const tagsToRemove = await this.ticketTagService.findMany(removeTags);
      tagsToRemove.forEach((tag) => {
        if (
          !userRoleIds.some((userRoleId) => {
            const isAllowed = tag.group.permissions.canRemoveRoles
              .map((r) => r._id.toString())
              .includes(userRoleId.toString());

            return isAllowed;
          })
        ) {
          throw new NotAllowedToRemoveThisTagError();
        }
      });
      ticket.tags = ticket.tags.filter(
        (tag) => !removeTags.includes(tag._id.toString()),
      );
    }

    if (addTags.length > 0) {
      const tagsToAdd = await this.ticketTagService.findMany(addTags);
      tagsToAdd.forEach((tag) => {
        if (
          !userRoleIds.some((userRoleId) => {
            const isAllowed = tag.group.permissions.canAddRoles
              .map((r) => r._id.toString())
              .includes(userRoleId.toString());

            return isAllowed;
          })
        ) {
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

  private stripInternalComments(ticket: TicketDocument, user: User) {
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
