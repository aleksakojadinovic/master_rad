import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { UserDTO } from '../../api/dto/user.dto';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserDTOProfile extends AutomapperProfile {
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
            return source.id;
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
          (destination) => destination.fullName,
          mapFrom((source) => `${source.firstName} ${source.lastName}`),
        ),
        forMember(
          (destination) => destination.initials,
          mapFrom((source) => `${source.firstName[0]}${source.lastName[0]}`),
        ),
        forMember(
          (destination) => destination.username,
          mapFrom((source) => source.username),
        ),
        forMember(
          (destination) => destination.role,
          mapFrom((source) => source.role),
        ),
        forMember(
          (destination) => destination.status,
          mapFrom((source) => source.status?.toString() ?? ''),
        ),
      );
    };
  }
}
