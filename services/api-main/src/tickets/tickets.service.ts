import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from 'src/tickets/schema/ticket.schema';
import { Model, isValidObjectId } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { ServiceErrors } from 'src/errors';
import { ok, err } from 'neverthrow';
import { v4 as uuid } from 'uuid';
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
import { User } from 'src/users/schema/user.schema';
import { TicketQueryDTO } from './dto/ticket-query.dto';
import { BaseService } from 'src/classes/BaseService';
import { EntityQueryDTO } from 'src/dto/EntityQueryDTO';

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

    return ok(ticketModel as Ticket);
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
    return ok(tickets);
  }

  async findOne(id: string, queryDTO: TicketQueryDTO = new TicketQueryDTO()) {
    const query = this.ticketModel.findOne({ _id: id });

    const populations = this.constructPopulate(queryDTO);
    populations.forEach((p) => query.populate(p));

    const ticket = await query.exec();

    if (!ticket) {
      return err({
        type: ServiceErrors.ENTITY_NOT_FOUND,
        message: 'Ticket not found',
      });
    }

    return ok(ticket);
  }

  async isTicketOwner(userId: string, ticketId: string) {
    const result = await this.findOne(ticketId);

    if (result.isErr()) {
      return result;
    }

    const ticket = result.value as Ticket;

    const creatorId = ticket.history[0].initiator._id.toString();

    return userId === creatorId;
  }

  async update(id: string, userId: string, updateTicketDto: UpdateTicketDto) {
    if (!isValidObjectId(id)) {
      return err({
        type: ServiceErrors.VALIDATION_FAILED,
        message: 'Invalid ticket id.',
      });
    }

    const user = await this.usersService.findOne(userId);

    const isCustomer = user.roles.map(({ name }) => name).includes('customer');
    const isTicketOwner = await this.isTicketOwner(userId, id);

    if (isCustomer && !isTicketOwner) {
      return err({
        type: ServiceErrors.ENTITY_NOT_FOUND,
        message: 'Ticket not found.',
      });
    }

    const ticketObject = await this.findOne(id);

    if (ticketObject.isErr()) {
      return ticketObject;
    }

    const ticket = ticketObject.value;

    if (!user) {
      return err({
        type: ServiceErrors.ENTITY_NOT_FOUND,
        message: 'User not found',
      });
    }

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
          return err({
            type: ServiceErrors.VALIDATION_FAILED,
            message: 'Invalid assignee user id',
          });
        }
        const assigneeUser = await this.usersService.findOne(assigneeId);
        if (!assigneeUser) {
          return err({
            type: ServiceErrors.ENTITY_NOT_FOUND,
            message: 'User not found.',
          });
        }
        if (assigneeUser.hasRole('customer')) {
          return err({
            type: ServiceErrors.PERMISSION_DENIED,
            message: 'Cannot assign a customer to a ticket',
          });
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

    return ok(ticket);
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
