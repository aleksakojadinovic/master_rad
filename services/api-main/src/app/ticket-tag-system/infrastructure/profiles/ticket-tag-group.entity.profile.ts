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
import { TicketTagGroup } from '../../domain/entities/ticket-tag-group.entity';
import { TicketTag } from '../../domain/entities/ticket-tag.entity';
import {
  CAN_ADD,
  CAN_REMOVE,
  CAN_SEE,
} from '../../domain/value-objects/ticket-tag-group-permissions';

@Injectable()
export class TicketTagGroupEntityProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        TicketTagGroupDb,
        TicketTagGroup,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source._id),
        ),
        forMember(
          (destination) => destination.tags,
          mapWithArguments((source, extra) => {
            const skipTags = extra && extra.skipTags;
            if (skipTags) {
              return [];
            }
            return this.mapper.mapArray(source.tags, TicketTagDb, TicketTag);
          }),
        ),
        forMember(
          (destination) => destination.permissions,
          mapFrom((source) => ({
            [CAN_SEE]: source.permissions.canSeeRoles,
            [CAN_ADD]: source.permissions.canAddRoles,
            [CAN_REMOVE]: source.permissions.canRemoveRoles,
          })),
        ),
        forMember(
          (destination) => destination.nameIntl,
          mapFrom((source) => source.nameIntl),
        ),
        forMember(
          (destination) => destination.descriptionIntl,
          mapFrom((source) => source.descriptionIntl),
        ),
      );
    };
  }
}
