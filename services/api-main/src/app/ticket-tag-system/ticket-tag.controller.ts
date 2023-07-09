import {
  Controller,
  Get,
  UseInterceptors,
  Query,
  Headers,
  Req,
} from '@nestjs/common';
import { TicketTagGroupService } from './ticket-tag-group.service';
import { TicketTagInterceptor } from './interceptors/ticket-tag.interceptor';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { TicketTagGroup } from './schema/ticket-tag-group.schema';
import { TicketTagGroupDTO } from './dto/ticket-tag-group.dto';
import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';
import { Request } from 'express';
import { resolveLanguageCode } from 'src/codebase/utils';
import { TicketTagService } from './ticket-tag.service';
import { TicketTagQueryPipe } from './pipes/ticket-tag-query-pipe';
import { TicketTag } from './schema/ticket-tag.schema';
import { TicketTagDTO } from './dto/ticket-tag.dto';

@UseInterceptors(TicketTagInterceptor)
@Controller('ticket-tag')
export class TicketTagController {
  constructor(
    private readonly ticketTagGroupService: TicketTagGroupService,
    private readonly ticketTagService: TicketTagService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Get()
  async findAll(
    @Query(new TicketTagQueryPipe(false)) queryDTO: EntityQueryDTO,
    @Req() req: Request,
  ) {
    // TODO: protect
    const languageCode = resolveLanguageCode(req);
    const tags = await this.ticketTagService.findAll(queryDTO);

    return this.mapper.mapArray(tags, TicketTag, TicketTagDTO, {
      extraArgs: () => ({
        languageCode,
      }),
    });
    // const ticketTagGroups = await this.ticketTagGroupService.findAll(queryDTO);
    // return this.mapper.mapArray(
    //   ticketTagGroups,
    //   TicketTagGroup,
    //   TicketTagGroupDTO,
    //   {
    //     extraArgs: () => ({
    //       languageCode,
    //     }),
    //   },
    // );
  }
}
