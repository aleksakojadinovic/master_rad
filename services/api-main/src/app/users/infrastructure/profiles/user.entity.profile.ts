import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserDb } from '../schema/user.schema';
import { USER_STATUS_VALUES } from '../../domain/value-objects/user-status';

// Maps DB object to domain object
@Injectable()
export class UserEntityProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        UserDb,
        User,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => {
            return source._id.toString();
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
          (destination) => destination.role,
          mapFrom((source) => source.role),
        ),
        forMember(
          (destination) => destination.passwordHash,
          mapFrom((source) => source.passwordHash),
        ),
        forMember(
          (destination) => destination.firebaseTokens,
          mapFrom((source) => source.firebaseTokens),
        ),
        forMember(
          (destination) => destination.status,
          mapFrom(
            (source) => USER_STATUS_VALUES[source.status?.toString()] ?? '',
          ),
        ),
        forMember(
          (destination) => destination.canUseAI,
          mapFrom((source) => source.canUseAI),
        ),
      );
    };
  }
}
