import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { TicketTagDb } from '../schema/ticket-tag.schema';
import { TicketTagGroupDb } from '../schema/ticket-tag-group.schema';
import { TicketTag } from '../../domain/entities/ticket-tag.entity';
import { TicketTagGroup } from '../../domain/entities/ticket-tag-group.entity';

@Injectable()
export class TicketTagEntityProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        TicketTagDb,
        TicketTag,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source._id.toString()),
        ),
        forMember(
          (destination) => destination.nameIntl,
          mapFrom((source) => source.nameIntl),
        ),
        forMember(
          (destination) => destination.descriptionIntl,
          mapFrom((source) => source.descriptionIntl),
        ),
        forMember(
          (destination) => destination.group,
          mapWithArguments((source) => {
            return mapper.map(source.group, TicketTagGroupDb, TicketTagGroup, {
              extraArgs: () => ({ skipTags: true }),
            });
          }),
        ),
      );
    };
  }
}
