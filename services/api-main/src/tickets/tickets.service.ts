import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Ticket,
  TicketHistoryEntryBodyChanged,
  TicketHistoryEntryStatusChange,
  TicketHistoryEntryType,
} from 'src/schemas/ticket.schema';
import { Model, isValidObjectId } from 'mongoose';
import {
  TicketHistoryItem,
  TicketHistoryEntryCreated,
} from 'src/schemas/ticket.schema';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/schemas/user.schema';
import { ServiceErrors } from 'src/errors';
import { ok, err } from 'neverthrow';
import { uuid } from 'uuidv4';
import { TicketDTO } from './dto/ticket.dto';
@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    private usersService: UsersService,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    const user: User = await this.usersService.findOne(createTicketDto.userId);

    const ticketObject = new Ticket();

    const initialEntry = TicketHistoryItem.create({
      initiator: user,
      entry: new TicketHistoryEntryCreated(
        createTicketDto.title,
        createTicketDto.body,
      ),
    });

    ticketObject.history = [initialEntry];

    const ticketModel = new this.ticketModel(ticketObject);

    await ticketModel.save();

    return TicketDTO.mapFromModel(ticketModel as Ticket);
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

    await ticket.save();

    return ok(ticket);
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
