import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TicketTagService } from './ticket-tag.service';
import { CreateTicketTagDto } from './dto/create-ticket-tag.dto';
import { UpdateTicketTagDto } from './dto/update-ticket-tag.dto';
import { CreateTicketTagGroupDTO } from './dto/create-ticket-tag-group.dto';

@Controller('ticket-tag')
export class TicketTagController {
  constructor(private readonly ticketTagService: TicketTagService) {}

  @Post()
  create(@Body() createTicketTagDto: CreateTicketTagDto) {
    return this.ticketTagService.create(createTicketTagDto);
  }

  @Post('group')
  createGroup(@Body() createTicketTagGroupDTO: CreateTicketTagGroupDTO) {
    // TODO: Validate
    return this.ticketTagService.createGroup(createTicketTagGroupDTO);
  }

  @Get()
  findAll() {
    return this.ticketTagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketTagService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTicketTagDto: UpdateTicketTagDto,
  ) {
    return this.ticketTagService.update(+id, updateTicketTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketTagService.remove(+id);
  }
}
