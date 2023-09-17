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
import { TicketsService } from '../domain/services/tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '@nestjs/passport';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { TicketDTO } from './dto/ticket.dto';
import { BaseController } from 'src/codebase/BaseController';
import { TicketQueryDTO } from './dto/ticket-query.dto';
import { TicketInterceptor } from '../infrastructure/interceptors/ticket.interceptor';
import { resolveLanguageCode } from 'src/codebase/utils';
import { Request } from 'express';
import { GetUserInfo } from 'src/codebase/decorators/user.decorator';
import { ExtractUserInfo } from 'src/codebase/guards/user.guard';
import { NotAllowedToSearchOthersTicketsAsACustomerError } from '../domain/errors/NotAllowedToSearchOthersTicketsAsACustomer';
import { User } from 'src/app/users/domain/entities/user.entity';
import { Ticket } from '../domain/entities/ticket.entity';
import { UpdateCommentDTO } from './dto/update-comment.dto';
import { TicketCommentService } from '../domain/services/ticket-comment.service';

@UseInterceptors(TicketInterceptor)
@Controller('tickets')
export class TicketsController extends BaseController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly ticketsCommentService: TicketCommentService,
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
    @Query(new ValidationPipe({ transform: true })) dto: TicketQueryDTO,
    @GetUserInfo() user: User,
  ) {
    if (user.isCustomer()) {
      if (!dto.createdBy || dto.createdBy !== user.id) {
        throw new NotAllowedToSearchOthersTicketsAsACustomerError();
      }
    }

    const tickets = await this.ticketsService.findAll(user, dto);

    return this.mapper.mapArray(tickets, Ticket, TicketDTO, {
      extraArgs: () => ({ include: dto.includes }),
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

  @Patch(':id/comment/:commentId/update')
  @UseGuards(AuthGuard('jwt'), ExtractUserInfo)
  async updateComment(
    @Param('id') ticketId: string,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDTO,
    @GetUserInfo() user: User,
  ) {
    const ticket = await this.ticketsCommentService.updateComment(
      ticketId,
      user,
      commentId,
      dto.body,
    );

    return this.mapper.map(ticket, Ticket, TicketDTO);
  }

  @Delete(':id/comment/:commentId/delete')
  @UseGuards(AuthGuard('jwt'), ExtractUserInfo)
  async deleteComment(
    @Param('id') ticketId: string,
    @Param('commentId') commentId: string,
    @GetUserInfo() user: User,
  ) {
    const ticket = await this.ticketsCommentService.deleteComment(
      ticketId,
      user,
      commentId,
    );
    return this.mapper.map(ticket, Ticket, TicketDTO);
  }
}
