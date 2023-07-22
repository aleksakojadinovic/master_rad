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
import { Ticket } from '../schema/ticket.schema';
import { TicketDTO } from '../dto/ticket.dto';
import { TicketHistoryItem } from '../schema/ticket-history.schema';
import { TicketHistoryItemDTO } from '../dto/ticket-history.dto';
import { User } from 'src/app/users/schema/user.schema';
import { UserDTO } from 'src/app/users/dto/user.dto';
import { Types } from 'mongoose';
import { TicketTag } from 'src/app/ticket-tag-system/schema/ticket-tag.schema';
import { TicketTagDTO } from 'src/app/ticket-tag-system/dto/ticket-tag.dto';

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
          mapFrom((source) =>
            source.history.map((item) =>
              mapper.map(item, TicketHistoryItem, TicketHistoryItemDTO),
            ),
          ),
        ),
        forMember(
          (destination) => destination.createdBy,
          mapFrom((source) => {
            if (source.createdBy instanceof Types.ObjectId) {
              return source.createdBy.toString();
            }

            return mapper.map(source.createdBy, User, UserDTO);
          }),
        ),
        forMember(
          (destination) => destination.assignees,
          mapFrom((source) => {
            return source.assignees.map((user) => {
              if (user instanceof Types.ObjectId) {
                return user;
              }
              return mapper.map(user, User, UserDTO);
            });
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
            return source.tags.map((tag) => {
              if (tag instanceof Types.ObjectId) {
                return tag;
              }
              return mapper.map(tag, TicketTag, TicketTagDTO, {
                extraArgs: () => ({ languageCode: extra['languageCode'] }),
              });
            });
          }),
        ),
      );
    };
  }
}
