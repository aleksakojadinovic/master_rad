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
  Req,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '@nestjs/passport';
import { Ticket } from 'src/tickets/schema/ticket.schema';
import { ServiceErrorInterceptor } from 'src/interceptors';
import { isValidObjectId } from 'mongoose';
import { err } from 'neverthrow';
import { ServiceErrors } from 'src/errors';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { TicketDTO } from './dto/ticket.dto';

@UseInterceptors(ServiceErrorInterceptor)
@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Request() req, @Body() createTicketDto: CreateTicketDto) {
    // TODO: Antipattern?
    const result = await this.ticketsService.create(
      req.user.id,
      createTicketDto,
    );
    if (result.isErr) {
      return result;
    }
    return result.value;
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) {
    if (!isValidObjectId(id)) {
      return err({
        type: ServiceErrors.VALIDATION_FAILED,
        message: 'Invalid ticket id',
      });
    }
    const result = await this.ticketsService.findOne(id);
    if (result.isOk()) {
      // TODO
      return this.mapper.map(result.value as Ticket, Ticket, TicketDTO);
    }

    return result.error;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    const result = await this.ticketsService.update(
      id,
      req.user._id,
      updateTicketDto,
    );

    if (result.isOk()) {
      const ticket = this.mapper.map(result.value, Ticket, TicketDTO);
      return ticket;
    }

    return result.error;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
