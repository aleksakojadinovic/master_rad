import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Notification } from '../../domain/entities/notification.entity';
import { User } from 'src/app/users/domain/entities/user.entity';
import {
  CommentAddedNotificationPayloadDb,
  NotificationDb,
} from '../schema/notification.schema';
import { TicketDb } from 'src/app/tickets/infrastructure/schema/ticket.schema';
import { Ticket } from 'src/app/tickets/domain/entities/ticket.entity';
import { NotificationPayloadCommentAdded } from '../../domain/value-objects/notification-payload-comment-added';
import { NotificationPayloadAssigned } from '../../domain/value-objects/notification-payload-assigned';
import { UserDb } from 'src/app/users/infrastructure/schema/user.schema';

@Injectable()
export class NotificationEntityProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        NotificationDb,
        Notification,
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
          mapFrom((source) => {
            switch (source.type) {
              case 'CommentAddedNotification':
                const commentPayload = new NotificationPayloadCommentAdded();
                commentPayload.ticket = mapper.map(
                  source.payload.ticket,
                  TicketDb,
                  Ticket,
                );
                commentPayload.user = mapper.map(
                  source.payload.user,
                  UserDb,
                  User,
                );
                commentPayload.comment = (
                  source.payload as CommentAddedNotificationPayloadDb
                ).comment;
                return commentPayload;
              case 'AssignedNotification':
                const assignPayload = new NotificationPayloadAssigned();
                assignPayload.ticket = mapper.map(
                  source.payload.ticket,
                  TicketDb,
                  Ticket,
                );
                assignPayload.user = mapper.map(
                  source.payload.user,
                  UserDb,
                  User,
                );
                return assignPayload;
              default:
                return null;
            }
          }),
        ),
      );
    };
  }
}
