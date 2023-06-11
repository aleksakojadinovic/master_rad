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
  Query,
} from '@nestjs/common';
import { TicketTagGroupService } from './ticket-tag-group.service';
import { CreateTicketTagDto } from './dto/create-ticket-tag.dto';
import { CreateTicketTagGroupDTO } from './dto/create-ticket-tag-group.dto';
import { UpdateTicketTagGroupDTO } from './dto/update-ticket-tag-group.dto';
import { isValidObjectId } from 'mongoose';
import { TicketTagInterceptor } from './interceptors/ticket-tag.interceptor';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { TicketTagGroup } from './schema/ticket-tag-group.schema';
import { TicketTagGroupDTO } from './dto/ticket-tag-group.dto';
import { TicketTagGroupQueryPipe } from './pipes/ticket-tag-group-query.pipe';
import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';

@UseInterceptors(TicketTagInterceptor)
@Controller('ticket-tag-group')
export class TicketTagGroupController {
  constructor(
    private readonly ticketTagGroupService: TicketTagGroupService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Post()
  async create(@Body() createTicketTagGroupDTO: CreateTicketTagGroupDTO) {
    // TODO: Validate, protect
    const group = await this.ticketTagGroupService.create(
      createTicketTagGroupDTO,
    );
    return this.mapper.map(group, TicketTagGroup, TicketTagGroupDTO);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query(new TicketTagGroupQueryPipe(false)) queryDTO: EntityQueryDTO,
  ) {
    const group = await this.ticketTagGroupService.findOne(id, queryDTO);
    return this.mapper.map(group, TicketTagGroup, TicketTagGroupDTO);
  }

  @Get()
  async findAll(
    @Query(new TicketTagGroupQueryPipe(false)) queryDTO: EntityQueryDTO,
  ) {
    // TODO: protect

    const ticketTagGroups = await this.ticketTagGroupService.findAll(queryDTO);
    return this.mapper.mapArray(
      ticketTagGroups,
      TicketTagGroup,
      TicketTagGroupDTO,
    );
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return null;
  // }

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
        const result = await this.ticketTagGroupService.addTagsToGroup(
          id,
          tags,
        );
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
    return this.ticketTagGroupService.remove(+id);
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
      ({ name, description }) =>
        new CreateTicketTagDto(name, description, '', ''),
    );
  }
}
