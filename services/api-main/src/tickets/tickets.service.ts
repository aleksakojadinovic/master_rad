import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from 'src/tickets/schema/ticket.schema';
import { Model, isValidObjectId } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/schema/user.schema';
import { ServiceErrors } from 'src/errors';
import { ok, err } from 'neverthrow';
import { v4 as uuid } from 'uuid';
import {
  TicketHistoryEntryBodyChanged,
  TicketHistoryEntryCommentAdded,
  TicketHistoryEntryCreated,
  TicketHistoryEntryStatusChange,
  TicketHistoryEntryTitleChanged,
  TicketHistoryItem,
} from './schema/ticket-history.schema';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { TicketState } from './schema/ticket-state.schema';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    @InjectMapper() private readonly mapper: Mapper,
    private usersService: UsersService,
  ) {}

  async create(userId: string, createTicketDto: CreateTicketDto) {
    const user: User = await this.usersService.findOne(userId);

    const ticketObject = new Ticket();

    const groupId = uuid();

    const initialEntry = TicketHistoryItem.create({
      initiator: user,
      groupId,
      entry: new TicketHistoryEntryCreated(),
    });

    const titleEntry = TicketHistoryItem.create({
      initiator: user,
      groupId,
      entry: new TicketHistoryEntryTitleChanged(createTicketDto.title),
    });

    const bodyEntry = TicketHistoryItem.create({
      initiator: user,
      groupId,
      entry: new TicketHistoryEntryBodyChanged(createTicketDto.body),
    });

    ticketObject.history = [initialEntry, titleEntry, bodyEntry];

    const ticketModel = new this.ticketModel(ticketObject);

    await ticketModel.save();

    return ok(ticketModel as Ticket);
  }

  findAll() {
    return `This action returns all tickets`;
  }

  async findOne(id: string) {
    const ticket = await this.ticketModel.findOne({ _id: id }).populate({
      path: 'history.initiator',
      model: 'User',
      populate: {
        path: 'roles',
        model: 'Role',
      },
    });

    if (!ticket) {
      return err({
        error: ServiceErrors.ENTITY_NOT_FOUND,
        message: 'Ticket not found',
      });
    }

    const resolvedTicket = ticket as Ticket;
    resolvedTicket.state = this.mapper.map(resolvedTicket, Ticket, TicketState);

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
        error: ServiceErrors.VALIDATION_FAILED,
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
        error: ServiceErrors.ENTITY_NOT_FOUND,
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

    await ticket.save();

    return ok(ticket as Ticket);
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
