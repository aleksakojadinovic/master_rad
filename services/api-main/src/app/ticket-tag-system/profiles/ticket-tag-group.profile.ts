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
import { TicketTagGroup } from '../schema/ticket-tag-group.schema';
import { TicketTagGroupDTO } from '../dto/ticket-tag-group.dto';
import { TicketTagGroupPermissionsDTO } from '../dto/ticket-tag-group-permissions.dto';

@Injectable()
export class TicketTagGroupProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        TicketTagGroup,
        TicketTagGroupDTO,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source._id),
        ),
        forMember(
          (destination) => destination.tags,
          mapWithArguments((source, extra) => {
            if (extra.include && (extra.include as string[]).includes('tags')) {
              return mapper.mapArray(source.tags, TicketTag, TicketTagDTO, {
                extraArgs: () => extra,
              });
            }
            return source.tags.map((tag) => tag._id.toString());
          }),
        ),
        forMember(
          (destination) => destination.permissions,
          mapFrom((source) => {
            const mappedPermissiones = new TicketTagGroupPermissionsDTO(
              source.permissions.canAddRoles,
              source.permissions.canRemoveRoles,
              source.permissions.canSeeRoles,
            );

            return mappedPermissiones;
          }),
        ),
        forMember(
          (destination) => destination.name,
          mapWithArguments((source, extraArgs) => {
            return source.nameIntl[extraArgs['languageCode'] as string];
          }),
        ),
        forMember(
          (destination) => destination.description,
          mapWithArguments(
            (source, extraArgs) =>
              source.descriptionIntl[extraArgs['languageCode'] as string],
          ),
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
