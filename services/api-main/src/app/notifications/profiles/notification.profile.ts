import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Notification } from '../schema/notification.schema';
import { NotificationDTO } from '../dto/notification.dto';

@Injectable()
export class NotificationProfile extends AutomapperProfile {
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
          mapFrom((source) => source._id),
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
          mapFrom((source) => source.payload),
        ),
      );
    };
  }
}
