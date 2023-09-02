import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketDocument } from 'src/app/tickets/schema/ticket.schema';
import mongoose, { Model, ObjectId, Types, isValidObjectId } from 'mongoose';
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
import { TicketStatus } from './types';
import { User } from 'src/app/users/schema/user.schema';
import { TicketQueryDTO } from './dto/ticket-query.dto';
import { BaseService } from 'src/codebase/BaseService';
import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';
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
    const ticketObject = new Ticket();

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

    const ticketModelInstance = new this.ticketModel(ticketObject);
    await ticketModelInstance.save();

    return ticketModelInstance;
  }

  async findAll(user: User, queryDTO: TicketQueryDTO) {
    const tickets = await this.ticketsRepository.findAll(
      queryDTO.page,
      queryDTO.perPage,
      queryDTO.status,
    );
    return tickets.map((ticket) => this.stripTags(ticket, user));
  }

  async findOne(id: string, user: User) {
    const ticket = await this.ticketsRepository.findById(id);

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    const isCustomer = user.roles.map(({ name }) => name).includes('customer');
    const isTicketOwner =
      ticket.createdBy._id.toString() === user._id.toString();

    if (isCustomer && !isTicketOwner) {
      throw new TicketNotFoundError(id);
    }

    this.stripTags(ticket, user);

    return ticket;
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

  updateTicketStatus(
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

  async update(id: string, user: User, updateTicketDto: UpdateTicketDto) {
    if (!isValidObjectId(id)) {
      throw new TicketIdNotValidError(id);
    }

    const userRoleIds = user.roles.map((role) => role._id);
    const isCustomer = user.roles.map(({ name }) => name).includes('customer');

    const ticket = await this.findOne(id, user);

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

    if (updateTicketDto.status != null) {
      const entry = new TicketHistoryEntryStatusChange(updateTicketDto.status);

      ticket.history.push(
        TicketHistoryItem.create({
          groupId,
          timestamp,
          initiator: user,
          entry,
        }),
      );

      ticket.status = updateTicketDto.status;
    }

    if (updateTicketDto.body != null) {
      const entry = new TicketHistoryEntryBodyChanged(updateTicketDto.body);
      ticket.history.push(
        TicketHistoryItem.create({
          groupId,
          timestamp,
          initiator: user,
          entry,
        }),
      );
      ticket.body = updateTicketDto.body;
    }

    const notifications: Notification[] = [];

    if (updateTicketDto.comment != null && updateTicketDto.comment.length > 0) {
      const entry = new TicketHistoryEntryCommentAdded(
        updateTicketDto.comment,
        new mongoose.Types.ObjectId().toString(),
      );
      ticket.history.push(
        TicketHistoryItem.create({
          groupId,
          timestamp,
          initiator: user,
          entry,
        }),
      );
      const notification = NotificationFactory.create((builder) =>
        builder
          .forUsers(
            ticket.assignees.filter(
              (assignee) =>
                (assignee as unknown as ObjectId).toString() !==
                user._id.toString(),
            ),
          )
          .forUsers(
            user._id.toString() !==
              (ticket.createdBy as unknown as Types.ObjectId).toString()
              ? [ticket.createdBy]
              : [],
          )
          .hasPayload('comment_added', (commentBuilder) =>
            commentBuilder
              .atTicket(ticket)
              .byUser(user)
              .hasCommentId(entry.commentId),
          ),
      );

      notifications.push(notification);
    }

    if (updateTicketDto.title != null) {
      const entry = new TicketHistoryEntryTitleChanged(updateTicketDto.title);
      ticket.history.push(
        TicketHistoryItem.create({
          groupId,
          timestamp,
          initiator: user,
          entry,
        }),
      );
      ticket.title = updateTicketDto.title;
    }

    if (
      updateTicketDto.addAssignees != null &&
      updateTicketDto.addAssignees.length > 0
    ) {
      const assignees: User[] = [];
      for (const assigneeId of updateTicketDto.addAssignees) {
        const assigneeUser = await this.usersService.findOne(assigneeId);
        if (!assigneeUser) {
          throw new AssigneeNotFoundError();
        }
        if (assigneeUser.hasRole('customer')) {
          throw new CannotAssignCustomerError(assigneeId);
        }
        if (
          ticket.assignees
            .map((user) => user._id.toString())
            .includes(assigneeId)
        ) {
          throw new DuplicateAssigneeError(assigneeId);
        }
        assignees.push(assigneeUser);
      }
      const entry = new TicketHistoryEntryAssigneesAdded(
        updateTicketDto.addAssignees,
      );
      // Shit, how do I add user id here? It's a POJO not a model :(
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
      const notification = NotificationFactory.create((builder) =>
        builder
          .forUsers(assignees)
          .hasPayload('assigned', (assignBuilder) =>
            assignBuilder.atTicket(ticket).byUser(user),
          ),
      );
      notifications.push(notification);
    }

    if (
      updateTicketDto.removeAssignees &&
      updateTicketDto.removeAssignees.length > 0
    ) {
      ticket.assignees = ticket.assignees.filter(
        (user) =>
          !updateTicketDto.removeAssignees.includes(user._id.toString()),
      );
      // TODO: history item
    }

    const addTags = updateTicketDto.addTags || [];
    const removeTags = updateTicketDto.removeTags || [];

    if (addTags.some((addId) => removeTags.includes(addId))) {
      throw new OverlapInTagIdsError();
    }

    // TODO: Move this check to a util function since it's very repetitive
    if (removeTags.length > 0) {
      const findDTO = new EntityQueryDTO();
      findDTO.includes = ['group'];
      const tagsToRemove = await this.ticketTagService.findMany(
        removeTags,
        findDTO,
      );
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
      const findDTO = new EntityQueryDTO();
      findDTO.includes = ['group'];
      const tagsToAdd = await this.ticketTagService.findMany(addTags, findDTO);
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

    await ticket.save();

    await this.notificationsService.emitNotifications(...notifications);

    return ticket;
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
}
