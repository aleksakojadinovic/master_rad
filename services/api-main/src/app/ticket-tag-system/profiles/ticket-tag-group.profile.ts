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
import { Role } from 'src/app/users/schema/role.schema';
import { RoleDTO } from 'src/app/users/dto/role.dto';
import { Types } from 'mongoose';

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
            const mappedTags = source.tags.map((tag) => {
              if (tag instanceof Types.ObjectId) {
                return tag.toString();
              }
              return mapper.map(tag, TicketTag, TicketTagDTO, {
                extraArgs: () => ({ languageCode: extra['languageCode'] }),
              });
            });
            return mappedTags;
          }),
        ),
        forMember(
          (destination) => destination.permissions,
          mapFrom((source) => {
            const mappedCanAddRoles = source.permissions.canAddRoles.map(
              (role) => {
                if (role instanceof Types.ObjectId) {
                  return role.toString();
                }
                return mapper.map(role, Role, RoleDTO);
              },
            );
            const mappedCanRemoveRoles = source.permissions.canRemoveRoles.map(
              (role) => {
                if (role instanceof Types.ObjectId) {
                  return role.toString();
                }
                return mapper.map(role, Role, RoleDTO);
              },
            );
            const mappedPermissiones = new TicketTagGroupPermissionsDTO(
              mappedCanAddRoles,
              mappedCanRemoveRoles,
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
          mapFrom((source) => source.nameIntl),
        ),
      );
    };
  }
}
