import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from 'src/app/tickets/schema/ticket.schema';
import { Model, isValidObjectId } from 'mongoose';
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
import { AssigneeIdNotValidError } from './errors/AssigneeIdNotValid';
import { CannotAssignCustomer } from './errors/CannotAssignCustomer';
// import { TooSoonToCreateAnotherTicket } from './errors/TooSoonToCreateAnotherTicket';

@Injectable()
export class TicketsService extends BaseService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    @InjectMapper() private readonly mapper: Mapper,
    private usersService: UsersService,
  ) {
    super();
  }

  override constructPopulate(queryDTO: EntityQueryDTO) {
    const populations = [];
    queryDTO.includes.forEach((includeField) => {
      if (includeField === 'createdBy') {
        populations.push({
          path: 'createdBy',
          model: 'User',
          populate: { path: 'roles', model: 'Role' },
        });
      }
      if (includeField === 'historyInitiator') {
        populations.push({
          path: 'history.initiator',
          model: 'User',
          populate: {
            path: 'roles',
            model: 'Role',
          },
        });
      }
    });
    return populations;
  }

  async create(userId: string, createTicketDto: CreateTicketDto) {
    const user = await this.usersService.findOne(userId);
    const mostRecentTicket = await this.ticketModel.findOne(
      { createdBy: userId },
      {},
      { sort: { createdAt: -1 } },
    );
    if (mostRecentTicket) {
      const createdAt = moment(mostRecentTicket.createdAt);
      const now = moment();

      const diffMinutes = now.diff(createdAt, 'minutes');

      if (diffMinutes <= 10) {
        // throw new TooSoonToCreateAnotherTicket(diffMinutes, 10 - diffMinutes);
      }
    }

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

    const ticketModel = new this.ticketModel(ticketObject);

    await ticketModel.save();

    return ticketModel;
  }

  async findAll(queryDTO: EntityQueryDTO) {
    const query = this.ticketModel.find({});

    const populations = this.constructPopulate(queryDTO);
    populations.forEach((p) => query.populate(p));

    if (queryDTO.filters.status) {
      query.where('status', queryDTO.filters.status);
    }

    query.skip((queryDTO.page - 1) * queryDTO.perPage).limit(queryDTO.perPage);

    const tickets = await query.exec();
    return tickets;
  }

  async findOne(id: string, queryDTO: TicketQueryDTO = new TicketQueryDTO()) {
    const query = this.ticketModel.findOne({ _id: id });

    const populations = this.constructPopulate(queryDTO);
    populations.forEach((p) => query.populate(p));
    const ticket = await query.exec();

    if (!ticket) {
      throw new TicketNotFoundError(id);
      // return err({
      //   type: ServiceErrors.ENTITY_NOT_FOUND,
      //   message: 'Ticket not found',
      // });
    }

    return ticket;
  }

  async isTicketOwner(userId: string, ticketId: string) {
    let ticket: Ticket;
    try {
      ticket = await this.findOne(ticketId);
    } catch (e) {
      throw e;
    }

    const creatorId = ticket.history[0].initiator._id.toString();

    return userId === creatorId;
  }

  async update(id: string, userId: string, updateTicketDto: UpdateTicketDto) {
    if (!isValidObjectId(id)) {
      throw new TicketIdNotValidError(id);
    }

    const user = await this.usersService.findOne(userId);

    const isCustomer = user.roles.map(({ name }) => name).includes('customer');
    const isTicketOwner = await this.isTicketOwner(userId, id);

    if (isCustomer && !isTicketOwner) {
      throw new TicketNotFoundError(id);
    }

    const ticket = await this.findOne(id);

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    // TODO
    // if (!user) {
    //   return err({
    //     type: ServiceErrors.ENTITY_NOT_FOUND,
    //     message: 'User not found',
    //   });
    // }

    const groupId = uuid();
    const timestamp = new Date();

    if (updateTicketDto.status != null) {
      // Add status change entry
      const entry = new TicketHistoryEntryStatusChange(updateTicketDto.status);

      ticket.history.push(
        TicketHistoryItem.create({
          groupId,
          timestamp,
          initiator: user,
          entry,
        }),
      );
      // TODO: maybe we should consider having a utility method that resolves this from history
      // and then we call it once at the end
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

    if (updateTicketDto.comment != null && updateTicketDto.comment.length > 0) {
      const entry = new TicketHistoryEntryCommentAdded(updateTicketDto.comment);
      ticket.history.push(
        TicketHistoryItem.create({
          groupId,
          timestamp,
          initiator: user,
          entry,
        }),
      );
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
      updateTicketDto.assignees != null &&
      updateTicketDto.assignees.length > 0
    ) {
      const assignees: User[] = [];
      for (const assigneeId of updateTicketDto.assignees) {
        if (!isValidObjectId(assigneeId)) {
          throw new AssigneeIdNotValidError(assigneeId);
        }
        const assigneeUser = await this.usersService.findOne(assigneeId);
        if (!assigneeUser) {
          throw new AssigneeIdNotValidError(assigneeId);
        }
        if (assigneeUser.hasRole('customer')) {
          throw new CannotAssignCustomer(assigneeId);
        }
        assignees.push(assigneeUser);
      }
      const entry = new TicketHistoryEntryAssigneesAdded(
        updateTicketDto.assignees,
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
    }

    await ticket.save();

    return ticket;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
