import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Ticket,
  TicketHistoryEntryStatusChange,
  TicketHistoryEntryType,
} from 'src/schemas/ticket.schema';
import { Model, isValidObjectId } from 'mongoose';
import { TicketHistoryEntry } from 'src/schemas/ticket.schema';
import { TicketHistoryEntryCreated } from 'src/schemas/ticket.schema';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/schemas/user.schema';
import { ServiceErrors } from 'src/errors';
import { ok, err } from 'neverthrow';
@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    private usersService: UsersService,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    const user: User = await this.usersService.findOne(createTicketDto.userId);

    const ticketObject = new Ticket();

    ticketObject.history = [
      new TicketHistoryEntry(
        new Date(),
        user,
        'New ticket',
        TicketHistoryEntryType.CREATED,
        new TicketHistoryEntryCreated(
          createTicketDto.title,
          createTicketDto.body,
        ),
      ),
    ];

    const ticketModel = new this.ticketModel(ticketObject);

    await ticketModel.save();

    return 'Ticket successfully created';
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

    return ok(ticket);
  }

  async update(id: string, userId: string, updateTicketDto: UpdateTicketDto) {
    // We assume that userId is validated on the controller I guess? Actually it's guaranteed to be correct
    // since it is extracted from jwt

    if (!isValidObjectId(id)) {
      return err({
        error: ServiceErrors.VALIDATION_FAILED,
        message: 'Invalid ticket id.',
      });
    }

    const ticketObject = await this.findOne(id);

    if (ticketObject.isErr()) {
      return ticketObject;
    }

    const ticket = ticketObject.value;

    const user: User = await this.usersService.findOne(userId);

    if (!user) {
      return err({
        error: ServiceErrors.ENTITY_NOT_FOUND,
        message: 'User not found',
      });
    }

    if (updateTicketDto.status != null) {
      // Add status change entry
      const newEntry = new TicketHistoryEntryStatusChange(
        updateTicketDto.status,
      );
      ticket.history.push(
        new TicketHistoryEntry(
          new Date(),
          user,
          '',
          TicketHistoryEntryType.STATUS_CHANGED,
          newEntry,
        ),
      );
    }

    await ticket.save();

    return ok(ticket);
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
