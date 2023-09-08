import {
  Controller,
  Get,
  UseInterceptors,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TicketTagGroupService } from '../../domain/services/ticket-tag-group.service';
import { TicketTagInterceptor } from '../../infrastructure/interceptors/ticket-tag.interceptor';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Request } from 'express';
import { resolveLanguageCode } from 'src/codebase/utils';
import { TicketTagService } from '../../domain/services/ticket-tag.service';
import { TicketTag } from '../../infrastructure/schema/ticket-tag.schema';
import { TicketTagDTO } from '../dto/ticket-tag.dto';
import { AuthGuard } from '@nestjs/passport';
import { ExtractUserInfo } from 'src/codebase/guards/user.guard';
import { GetUserInfo } from 'src/codebase/decorators/user.decorator';
import { User } from '../../../users/infrastructure/schema/user.schema';
import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';

@UseInterceptors(TicketTagInterceptor)
@Controller('ticket-tags')
export class TicketTagController {
  constructor(
    private readonly ticketTagGroupService: TicketTagGroupService,
    private readonly ticketTagService: TicketTagService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), ExtractUserInfo)
  async findAll(
    @Query(new ValidationPipe({ transform: true })) queryDTO: EntityQueryDTO,
    @Req() req: Request,
    @GetUserInfo() user: User,
  ) {
    const languageCode = resolveLanguageCode(req);
    const tags = await this.ticketTagService.findAll(user);

    return this.mapper.mapArray(tags as TicketTag[], TicketTag, TicketTagDTO, {
      extraArgs: () => ({
        languageCode,
        include: queryDTO.includes,
      }),
    });
  }
}
