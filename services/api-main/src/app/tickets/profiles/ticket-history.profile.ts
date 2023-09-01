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
import { TicketHistoryItem } from '../schema/ticket-history.schema';
import { TicketHistoryItemDTO } from '../dto/ticket-history.dto';
import { User } from 'src/app/users/schema/user.schema';
import { UserDTO } from 'src/app/users/dto/user.dto';

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
          mapWithArguments((source, extra) => {
            if (
              extra.include &&
              (extra.include as string[]).includes('historyInitiator')
            ) {
              return mapper.map(source.initiator, User, UserDTO, {
                extraArgs: () => extra,
              });
            }
            return source.initiator._id.toString();
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
