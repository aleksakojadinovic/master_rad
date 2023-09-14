import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { NotificationDTO } from '../../api/dto/notification.dto';
import { UserDTO } from 'src/app/users/api/dto/user.dto';
import { Notification } from '../../domain/entities/notification.entity';
import { User } from 'src/app/users/domain/entities/user.entity';

@Injectable()
export class NotificationDTOProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        Notification,
        NotificationDTO,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
        forMember(
          (destination) => destination.createdAt,
          mapFrom((source) => source.createdAt),
        ),
        forMember(
          (destination) => destination.readAt,
          mapFrom((source) => source.readAt ?? null),
        ),
        forMember(
          (destination) => destination.type,
          mapFrom((source) => source.type),
        ),
        forMember(
          (destination) => destination.payload,
          mapFrom((source) => {
            const payloadUser = source.payload.user;
            if (!payloadUser) {
              return source.payload;
            }
            return {
              ...source.payload,
              user: mapper.map(source.payload.user as User, User, UserDTO),
            };
          }),
        ),
      );
    };
  }
}
