import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketHistoryEntryType } from 'src/schemas/ticket.schema';
import { Model } from 'mongoose';
import { TicketHistoryEntry } from 'src/schemas/ticket.schema';
import { TicketHistoryEntryCreated } from 'src/schemas/ticket.schema';

@Injectable()
export class TicketsService {
  constructor(@InjectModel(Ticket.name) private ticketModel: Model<Ticket>) {}

  async create(createTicketDto: CreateTicketDto) {
    const ticketObject = new Ticket();

    ticketObject.history = [
      new TicketHistoryEntry(
        new Date(),
        createTicketDto.userId,
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

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
