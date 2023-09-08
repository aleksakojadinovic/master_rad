import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Ticket } from '../../infrastructure/schema/ticket.schema';
import { TicketDTO } from '../dto/ticket.dto';
import { TicketHistoryItem } from '../../infrastructure/schema/ticket-history.schema';
import { TicketHistoryItemDTO } from '../dto/ticket-history.dto';
import { User } from 'src/app/users/infrastructure/schema/user.schema';
import { UserDTO } from 'src/app/users/api/dto/user.dto';
import { TicketTag } from 'src/app/ticket-tag-system/infrastructure/schema/ticket-tag.schema';
import { TicketTagDTO } from 'src/app/ticket-tag-system/api/dto/ticket-tag.dto';

@Injectable()
export class TicketProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        Ticket,
        TicketDTO,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source._id),
        ),
        forMember(
          (destination) => destination.history,
          mapWithArguments((source, extra) =>
            source.history.map((item) =>
              mapper.map(item, TicketHistoryItem, TicketHistoryItemDTO, {
                extraArgs: () => extra,
              }),
            ),
          ),
        ),
        forMember(
          (destination) => destination.createdBy,
          mapWithArguments((source, extra) => {
            if (
              extra.include &&
              (extra.include as string[]).includes('createdBy')
            ) {
              return mapper.map(source.createdBy, User, UserDTO, {
                extraArgs: () => extra,
              });
            }

            return source.createdBy._id.toString();
          }),
        ),
        forMember(
          (destination) => destination.assignees,
          mapWithArguments((source, extra) => {
            if (
              extra.include &&
              (extra.include as string[]).includes('assignees')
            ) {
              return mapper.mapArray(source.assignees, User, UserDTO, {
                extraArgs: () => extra,
              });
            }
            return source.assignees.map((user) => user._id.toString());
          }),
        ),
        forMember(
          (destination) => destination.createdAt,
          mapFrom((source) => source.createdAt),
        ),
        forMember(
          (destination) => destination.title,
          mapFrom((source) => source.title),
        ),
        forMember(
          (destination) => destination.body,
          mapFrom((source) => source.body),
        ),
        forMember(
          (destination) => destination.status,
          mapFrom((source) => source.status),
        ),
        forMember(
          (destination) => destination.tags,
          mapWithArguments((source, extra) => {
            const includeArray = extra.include
              ? (extra.include as string[])
              : [];

            if (includeArray.includes('tags')) {
              const includeGroupIndex = includeArray.indexOf('tags.group');

              if (includeGroupIndex !== -1) {
                includeArray[includeGroupIndex] = 'group';
              }

              return mapper.mapArray(source.tags, TicketTag, TicketTagDTO, {
                extraArgs: () => ({ ...extra, include: includeArray }),
              });
            }
            return source.tags.map((tag) => tag._id.toString());
          }),
        ),
      );
    };
  }
}
