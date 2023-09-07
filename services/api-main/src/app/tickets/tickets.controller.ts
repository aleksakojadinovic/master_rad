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
import { Ticket } from 'src/app/tickets/infrastructure/schema/ticket.schema';
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
import { User } from '../users/infrastructure/schema/user.schema';
import { ExtractUserInfo } from 'src/codebase/guards/user.guard';
import { NotAllowedToSearchOthersTicketsAsACustomerError } from './errors/NotAllowedToSearchOthersTicketsAsACustomer';

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
  @UseGuards(AuthGuard('jwt'), ExtractUserInfo)
  async create(
    @Body() createTicketDto: CreateTicketDto,
    @GetUserInfo() user: User,
  ) {
    const ticket = await this.ticketsService.create(user, createTicketDto);
    return ticket;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), ExtractUserInfo)
  async findAll(
    @Query(new ValidationPipe({ transform: true })) queryDTO: TicketQueryDTO,
    @GetUserInfo() user: User,
  ) {
    if (user.isCustomer()) {
      if (!queryDTO.createdBy || queryDTO.createdBy !== user._id.toString()) {
        throw new NotAllowedToSearchOthersTicketsAsACustomerError();
      }
    }

    const tickets = await this.ticketsService.findAll(user, queryDTO);

    return this.mapper.mapArray(tickets, Ticket, TicketDTO, {
      extraArgs: () => ({ include: queryDTO.includes }),
    });
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

    const ticket = await this.ticketsService.findOne(id, user);

    return this.mapper.map(ticket, Ticket, TicketDTO, {
      extraArgs: () => ({ languageCode, include: queryDTO.includes }),
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), ExtractUserInfo)
  async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @GetUserInfo() user: User,
  ) {
    const ticket = await this.ticketsService.update(id, user, updateTicketDto);

    return this.mapper.map(ticket, Ticket, TicketDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
