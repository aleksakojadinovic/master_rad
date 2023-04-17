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
  NotFoundException,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '@nestjs/passport';
import { Ticket } from 'src/schemas/ticket.schema';
import { TicketDTO } from './dto/ticket.dto';
import { ServiceErrorInterceptor } from 'src/interceptors';
import { isValidObjectId } from 'mongoose';
import { err } from 'neverthrow';
import { ServiceErrors } from 'src/errors';
import { User } from 'src/schemas/user.schema';

@UseInterceptors(ServiceErrorInterceptor)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Request() req, @Body() createTicketDto: CreateTicketDto) {
    // TODO: Antipattern?
    createTicketDto.userId = req.user.id;
    return this.ticketsService.create(createTicketDto);
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
      return TicketDTO.mapFromModel(result.value as Ticket);
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
    const user = req.user as User;

    // This is allowed either for agents or for authors of the ticket

    const hasRequiredRole = user.roles
      .map(({ name }) => name)
      .some((role) => ['agent', 'admin'].includes(role));

    console.log({ user });

    const isTicketOwner = await this.ticketsService.isTicketOwner(user._id, id);

    console.log({ hasRequiredRole, isTicketOwner });

    if (!hasRequiredRole && !isTicketOwner) {
      throw new NotFoundException();
    }

    const result = await this.ticketsService.update(
      id,
      req.user.id,
      updateTicketDto,
    );
    if (result.isOk()) {
      const ticket = TicketDTO.mapFromModel(result.value as Ticket);
      return ticket;
    }

    return result.error;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
