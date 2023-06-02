import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from 'src/app/tickets/schema/ticket.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Injectable()
export class TicketsRepository {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    @InjectMapper() private readonly mapper: Mapper,
    private usersService: UsersService,
  ) {}
}
