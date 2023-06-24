import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { TicketTag } from '../schema/ticket-tag.schema';
import { TicketTagDTO } from '../dto/ticket-tag.dto';

@Injectable()
export class TicketTagProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        TicketTag,
        TicketTagDTO,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source._id),
        ),
        forMember(
          (destination) => destination.name,
          mapWithArguments(
            (source, extraArgs) =>
              source.nameIntl[extraArgs['languageCode'] as string],
          ),
        ),
        forMember(
          (destination) => destination.description,
          mapWithArguments(
            (source, extraArgs) =>
              source.descriptionIntl[extraArgs['languageCode'] as string],
          ),
        ),
      );
    };
  }
}
