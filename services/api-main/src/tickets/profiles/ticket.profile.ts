import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Ticket } from '../schema/ticket.schema';
import { TicketDTO } from '../dto/ticket.dto';
import { TicketHistoryItem } from '../schema/ticket-history.schema';
import { TicketHistoryItemDTO } from '../dto/ticket-history.dto';
import { User } from 'src/users/schema/user.schema';
import { UserDTO } from 'src/users/dto/user.dto';

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
          mapFrom((source) => mapper.map(source.createdBy, User, UserDTO)),
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
      );
    };
  }
}
