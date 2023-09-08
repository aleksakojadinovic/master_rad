import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  BadRequestException,
  UseInterceptors,
  Query,
  Headers,
  Req,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { TicketTagGroupService } from '../../domain/services/ticket-tag-group.service';
import { CreateTicketTagGroupDTO } from '../dto/create-ticket-tag-group.dto';
import { CreateOrUpdateTicketTagGroupDTO } from '../dto/update-ticket-tag-group.dto';
import { isValidObjectId } from 'mongoose';
import { TicketTagInterceptor } from '../../infrastructure/interceptors/ticket-tag.interceptor';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { TicketTagGroupDTO } from '../dto/ticket-tag-group.dto';
import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';
import { Request } from 'express';
import { resolveLanguageCode } from 'src/codebase/utils';
import { AuthGuard } from '@nestjs/passport';
import { ExtractUserInfo } from 'src/codebase/guards/user.guard';
import { GetUserInfo } from 'src/codebase/decorators/user.decorator';
import { TicketTagGroup } from '../../domain/entities/ticket-tag-group.entity';
import { User } from 'src/app/users/domain/entities/user.entity';

@UseInterceptors(TicketTagInterceptor)
@Controller('ticket-tag-groups')
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

  // TODO: proteccc
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query(new ValidationPipe({ transform: true })) queryDTO: EntityQueryDTO,
    @Req() req: Request,
  ) {
    const languageCode = resolveLanguageCode(req);
    const group = await this.ticketTagGroupService.findOne(id);
    return this.mapper.map(group, TicketTagGroup, TicketTagGroupDTO, {
      extraArgs: () => ({ languageCode, include: queryDTO.includes }),
    });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), ExtractUserInfo)
  async findAll(
    @Headers('accept-language') acceptLanguage: any,
    @Query(new ValidationPipe({ transform: true })) queryDTO: EntityQueryDTO,
    @Req() req: Request,
    @GetUserInfo() user: User,
  ) {
    // TODO: protect
    const languageCode = resolveLanguageCode(req);
    const ticketTagGroups = await this.ticketTagGroupService.findAll(
      queryDTO,
      user,
    );
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
    updateTicketTagGroupDto: CreateOrUpdateTicketTagGroupDTO,
    @Req() req: Request,
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid group id: ${id}`);
    }
    const languageCode = resolveLanguageCode(req);

    const group = await this.ticketTagGroupService.update(
      id,
      updateTicketTagGroupDto,
    );

    return this.mapper.map(group, TicketTagGroup, TicketTagGroupDTO, {
      extraArgs: () => ({ languageCode }),
    });
  }
}
