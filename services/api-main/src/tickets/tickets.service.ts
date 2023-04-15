import { Inject, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketHistoryEntryType } from 'src/schemas/ticket.schema';
import { Model } from 'mongoose';
import { TicketHistoryEntry } from 'src/schemas/ticket.schema';
import { TicketHistoryEntryCreated } from 'src/schemas/ticket.schema';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/schemas/user.schema';
import { Role } from 'src/schemas/role.schema';

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

    return ticket;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
