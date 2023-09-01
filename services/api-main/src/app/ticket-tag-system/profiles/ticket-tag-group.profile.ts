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
          mapWithArguments((source, extra) => {
            const shouldIncludeRoles =
              extra.include && (extra.include as string[]).includes('roles');
            console.log({ extra });

            const mapRoleList = (roleList: Role[]) =>
              shouldIncludeRoles
                ? mapper.mapArray(roleList, Role, RoleDTO, {
                    extraArgs: () => extra,
                  })
                : roleList.map((role) => role._id.toString());

            console.log(source.permissions.canAddRoles);

            const mappedCanAddRoles = mapRoleList(
              source.permissions.canAddRoles,
            );

            const mappedCanRemoveRoles = mapRoleList(
              source.permissions.canRemoveRoles,
            );

            const mappedCanSeeRoles = mapRoleList(
              source.permissions.canSeeRoles,
            );

            console.log({ mappedCanAddRoles });

            const mappedPermissiones = new TicketTagGroupPermissionsDTO(
              mappedCanAddRoles,
              mappedCanRemoveRoles,
              mappedCanSeeRoles,
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
