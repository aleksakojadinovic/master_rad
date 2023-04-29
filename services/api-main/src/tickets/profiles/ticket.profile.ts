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
import { TicketState } from '../schema/ticket-state.schema';
import { TicketStateDTO } from '../dto/ticket-state.dto';

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
          (destination) => destination.state,
          mapFrom((source) =>
            mapper.map(source.state, TicketState, TicketStateDTO),
          ),
        ),
      );
    };
  }
}
