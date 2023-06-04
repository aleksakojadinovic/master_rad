import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '@nestjs/passport';
import { Ticket } from 'src/app/tickets/schema/ticket.schema';
import { isValidObjectId } from 'mongoose';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { TicketDTO } from './dto/ticket.dto';
import { BaseController } from 'src/classes/BaseController';
import { TicketQueryDTO } from './dto/ticket-query.dto';
import { TicketQueryPipe } from './pipes/ticket-query.pipe';
import { EntityQueryDTO } from 'src/dto/EntityQueryDTO';
import { TicketInterceptor } from './interceptors/ticket.interceptor';
import { TicketIdNotValidError } from './errors/TicketIdNotValid';

@UseInterceptors(TicketInterceptor)
@Controller('tickets')
export class TicketsController extends BaseController {
  constructor(
    private readonly ticketsService: TicketsService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {
    super();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Request() req, @Body() createTicketDto: CreateTicketDto) {
    const ticket = await this.ticketsService.create(
      req.user._id,
      createTicketDto,
    );
    return ticket;
  }

  @Get()
  async findAll(@Query(new TicketQueryPipe(true)) queryDTO: EntityQueryDTO) {
    const tickets = await this.ticketsService.findAll(queryDTO);
    return this.mapper.mapArray(tickets, Ticket, TicketDTO);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query(new TicketQueryPipe()) queryDTO: TicketQueryDTO,
  ) {
    if (!isValidObjectId(id)) {
      throw new TicketIdNotValidError(id);
    }
    const ticket = await this.ticketsService.findOne(id, queryDTO);
    return this.mapper.map(ticket, Ticket, TicketDTO);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    const ticket = await this.ticketsService.update(
      id,
      req.user._id,
      updateTicketDto,
    );

    return this.mapper.map(ticket, Ticket, TicketDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
