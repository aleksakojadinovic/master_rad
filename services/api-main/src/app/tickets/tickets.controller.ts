import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
  Req,
  ValidationPipe,
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
import { BaseController } from 'src/codebase/BaseController';
import { TicketQueryDTO } from './dto/ticket-query.dto';
import { TicketInterceptor } from './interceptors/ticket.interceptor';
import { TicketIdNotValidError } from './errors/TicketIdNotValid';
import { resolveLanguageCode } from 'src/codebase/utils';
import { Request } from 'express';
import { GetUserInfo } from 'src/codebase/decorators/user.decorator';
import { User } from '../users/schema/user.schema';
import { ExtractUserInfo } from 'src/codebase/guards/user.guard';

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
  async create(@Req() req, @Body() createTicketDto: CreateTicketDto) {
    const ticket = await this.ticketsService.create(
      req.user._id,
      createTicketDto,
    );
    return ticket;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(
    @Query(new ValidationPipe({ transform: true })) queryDTO: TicketQueryDTO,
  ) {
    const tickets = await this.ticketsService.findAll(queryDTO);
    return this.mapper.mapArray(tickets, Ticket, TicketDTO);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), ExtractUserInfo)
  async findOne(
    @Param('id') id: string,
    @Query(new ValidationPipe({ transform: true })) queryDTO: TicketQueryDTO,
    @Req() req: Request,
    @GetUserInfo() user: User,
  ) {
    const languageCode = resolveLanguageCode(req);
    if (!isValidObjectId(id)) {
      throw new TicketIdNotValidError(id);
    }
    const ticket = await this.ticketsService.findOne(id, user, queryDTO);
    return this.mapper.map(ticket, Ticket, TicketDTO, {
      extraArgs: () => ({ languageCode }),
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Req() req,
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
