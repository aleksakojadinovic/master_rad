import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { TicketTagService } from './ticket-tag.service';
import { CreateTicketTagDto } from './dto/create-ticket-tag.dto';
import { CreateTicketTagGroupDTO } from './dto/create-ticket-tag-group.dto';
import { UpdateTicketTagGroupDTO } from './dto/update-ticket-tag-group.dto';
import { isValidObjectId } from 'mongoose';
import { TicketTagInterceptor } from './interceptors/ticket-tag.interceptor';

@UseInterceptors(TicketTagInterceptor)
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
    return null;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTicketTagDto: UpdateTicketTagGroupDTO,
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid group id: ${id}`);
    }

    switch (updateTicketTagDto.action) {
      case 'ADD_TAGS':
        const tags = this.getAddTagsPayload(updateTicketTagDto.payload);
        const result = await this.ticketTagService.addTagsToGroup(id, tags);
        // TODO map
        return result;
      default:
        throw new BadRequestException(
          `Unknown action: ${updateTicketTagDto.action}`,
        );
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketTagService.remove(+id);
  }

  private getAddTagsPayload(payload: any): CreateTicketTagDto[] {
    if (!payload || !payload.tags || !Array.isArray(payload.tags)) {
      throw new BadRequestException('Invalid payload');
    }
    for (const tag of payload.tags) {
      if (!tag.name) {
        throw new BadRequestException(`Invalid tag name ${tag.name}`);
      }
      if (!tag.description) {
        throw new BadRequestException(
          `Invalid tag description ${tag.description}`,
        );
      }
    }
    return payload.tags.map(
      ({ name, description }) => new CreateTicketTagDto(name, description),
    );
  }
}
