import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { User } from '../schema/user.schema';
import { UserDTO } from '../dto/user.dto';
import { Role } from '../schema/role.schema';
import { RoleDTO } from '../dto/role.dto';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        User,
        UserDTO,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => {
            return source._id;
          }),
        ),
        forMember(
          (destination) => destination.firstName,
          mapFrom((source) => source.firstName),
        ),
        forMember(
          (destination) => destination.lastName,
          mapFrom((source) => source.lastName),
        ),
        forMember(
          (destination) => destination.username,
          mapFrom((source) => source.username),
        ),
        forMember(
          (destination) => destination.roles,
          mapWithArguments((source, extra) => {
            if (
              extra.include &&
              (extra.include as string[]).includes('roles')
            ) {
              return mapper.mapArray(source.roles, Role, RoleDTO, {
                extraArgs: () => extra,
              });
            }
            return source.roles.map((role) => role._id.toString());
          }),
        ),
      );
    };
  }
}
