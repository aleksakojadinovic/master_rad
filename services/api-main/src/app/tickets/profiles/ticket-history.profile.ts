import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { TicketHistoryItem } from '../schema/ticket-history.schema';
import { TicketHistoryItemDTO } from '../dto/ticket-history.dto';
import { User } from 'src/users/schema/user.schema';
import { UserDTO } from 'src/users/dto/user.dto';
import { Types } from 'mongoose';

@Injectable()
export class TicketHistoryItemProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        TicketHistoryItem,
        TicketHistoryItemDTO,
        forMember(
          (destination) => destination.type,
          mapFrom((source) => source.entryType),
        ),
        forMember(
          (destination) => destination.timestamp,
          mapFrom((source) => source.timestamp),
        ),
        forMember(
          (destination) => destination.user,
          mapFrom((source) => {
            if (source.initiator instanceof Types.ObjectId) {
              return source.initiator.toString();
            }
            return mapper.map(source.initiator, User, UserDTO);
          }),
        ),
        forMember(
          (destination) => destination.payload,
          mapFrom((source) => source.entry),
        ),
      );
    };
  }
}
