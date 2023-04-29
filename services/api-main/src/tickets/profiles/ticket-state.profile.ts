import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { TicketState } from '../schema/ticket-state.schema';
import { TicketStateDTO } from '../dto/ticket-state.dto';
import { User } from 'src/users/schema/user.schema';
import { UserDTO } from 'src/users/dto/user.dto';

@Injectable()
export class TicketStateProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        TicketState,
        TicketStateDTO,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
        forMember(
          (destination) => destination.body,
          mapFrom((source) => {
            return source.body;
          }),
        ),
        forMember(
          (destination) => destination.createdAt,
          mapFrom((source) => {
            return source.createdAt;
          }),
        ),
        forMember(
          (destination) => destination.createdBy,
          mapFrom((source) => {
            return mapper.map(source.createdBy, User, UserDTO);
          }),
        ),
        forMember(
          (destination) => destination.status,
          mapFrom((source) => {
            return source.status;
          }),
        ),
        forMember(
          (destination) => destination.title,
          mapFrom((source) => {
            return source.title;
          }),
        ),
      );
    };
  }
}
