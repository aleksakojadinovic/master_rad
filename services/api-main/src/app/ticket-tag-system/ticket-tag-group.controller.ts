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
  Headers,
  Req,
  ValidationPipe,
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
import { Request } from 'express';
import { resolveLanguageCode } from 'src/codebase/utils';

@UseInterceptors(TicketTagInterceptor)
@Controller('ticket-tag-group')
export class TicketTagGroupController {
  constructor(
    private readonly ticketTagGroupService: TicketTagGroupService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Post()
  async create(
    @Body() createTicketTagGroupDTO: CreateTicketTagGroupDTO,
    @Req() req: Request,
  ) {
    // TODO: Validate, protect
    const languageCode = resolveLanguageCode(req);
    const group = await this.ticketTagGroupService.create(
      createTicketTagGroupDTO,
    );
    return this.mapper.map(group, TicketTagGroup, TicketTagGroupDTO, {
      extraArgs: () => ({ languageCode }),
    });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query(new TicketTagGroupQueryPipe(false)) queryDTO: EntityQueryDTO,
    @Req() req: Request,
  ) {
    const languageCode = resolveLanguageCode(req);
    const group = await this.ticketTagGroupService.findOne(id, queryDTO);
    return this.mapper.map(group, TicketTagGroup, TicketTagGroupDTO, {
      extraArgs: () => ({ languageCode }),
    });
  }

  @Get()
  async findAll(
    @Headers('accept-language') acceptLanguage: any,
    @Query(new TicketTagGroupQueryPipe(false)) queryDTO: EntityQueryDTO,
    @Req() req: Request,
  ) {
    // TODO: protect
    const languageCode = resolveLanguageCode(req);
    const ticketTagGroups = await this.ticketTagGroupService.findAll(queryDTO);
    return this.mapper.mapArray(
      ticketTagGroups,
      TicketTagGroup,
      TicketTagGroupDTO,
      {
        extraArgs: () => ({
          languageCode,
        }),
      },
    );
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return null;
  // }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe())
    updateTicketTagGroupDto: UpdateTicketTagGroupDTO,
    @Req() req: Request,
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid group id: ${id}`);
    }
    console.log(updateTicketTagGroupDto);

    await this.ticketTagGroupService.update(id, updateTicketTagGroupDto);

    return 'testing';
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
      if (!tag.nameIntl) {
        throw new BadRequestException(`Tag nameIntl is required`);
      }
      if (!tag.descriptionIntl) {
        throw new BadRequestException(`Tag descritionIntl is required`);
      }
    }
    return payload.tags.map(
      ({ nameIntl, descriptionIntl }) =>
        new CreateTicketTagDto(nameIntl, descriptionIntl, ''),
    );
  }
}
