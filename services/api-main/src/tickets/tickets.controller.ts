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
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '@nestjs/passport';
import { Ticket } from 'src/schemas/ticket.schema';
import { TicketDTO } from './dto/ticket.dto';
import { ServiceErrorInterceptor } from 'src/interceptors';

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
  async findOne(@Param('id') id: string) {
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
