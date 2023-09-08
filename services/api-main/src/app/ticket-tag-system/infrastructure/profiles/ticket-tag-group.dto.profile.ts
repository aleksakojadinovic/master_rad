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
import { TicketTagDTO } from '../../api/dto/ticket-tag.dto';
import { TicketTagGroupDb } from '../schema/ticket-tag-group.schema';
import { TicketTagGroupDTO } from '../../api/dto/ticket-tag-group.dto';
import { TicketTagGroupPermissionsDTO } from '../../api/dto/ticket-tag-group-permissions.dto';
import {
  CAN_ADD,
  CAN_REMOVE,
  CAN_SEE,
} from '../../domain/value-objects/ticket-tag-group-permissions';

@Injectable()
export class TicketTagGroupDTOProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        TicketTagGroupDb,
        TicketTagGroupDTO,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source._id),
        ),
        forMember(
          (destination) => destination.tags,
          mapWithArguments((source, extra) => {
            if (extra.include && (extra.include as string[]).includes('tags')) {
              return mapper.mapArray(source.tags, TicketTagDb, TicketTagDTO, {
                extraArgs: () => extra,
              });
            }
            return source.tags.map((tag) => tag._id.toString());
          }),
        ),
        forMember(
          (destination) => destination.permissions,
          mapFrom((source) => {
            const dto = new TicketTagGroupPermissionsDTO();
            dto.canAdd = source.permissions[CAN_ADD];
            dto.canRemove = source.permissions[CAN_REMOVE];
            dto.canSee = source.permissions[CAN_SEE];
            return dto;
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
