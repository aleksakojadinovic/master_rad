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
import { TicketDTO } from '../dto/ticket.dto';
import { UserDTO } from 'src/app/users/api/dto/user.dto';
import { TicketTagDTO } from 'src/app/ticket-tag-system/api/dto/ticket-tag.dto';
import { Ticket } from '../../domain/entities/ticket.entity';
import { User } from 'src/app/users/domain/entities/user.entity';
import { TicketTag } from 'src/app/ticket-tag-system/domain/entities/ticket-tag.entity';
import { CommentDTO } from '../dto/comment.dto';
import { StatusChangeDTO } from '../dto/status-change.dto';
import { AssigneeChangeDTO } from '../dto/assignee-change.dto';

@Injectable()
export class TicketDTOProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        Ticket,
        TicketDTO,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
        forMember(
          (destination) => destination.createdBy,
          mapWithArguments((source, extra) => {
            if (
              extra.include &&
              (extra.include as string[]).includes('createdBy')
            ) {
              return mapper.map(source.createdBy, User, UserDTO, {
                extraArgs: () => extra,
              });
            }

            return source.createdBy.id;
          }),
        ),
        forMember(
          (destination) => destination.assignees,
          mapWithArguments((source, extra) => {
            if (
              extra.include &&
              (extra.include as string[]).includes('assignees')
            ) {
              return mapper.mapArray(source.assignees, User, UserDTO, {
                extraArgs: () => extra,
              });
            }
            return source.assignees.map((user) => user.id);
          }),
        ),
        forMember(
          (destination) => destination.createdAt,
          mapFrom((source) => source.createdAt),
        ),
        forMember(
          (destination) => destination.title,
          mapFrom((source) => source.title),
        ),
        forMember(
          (destination) => destination.body,
          mapFrom((source) => source.body),
        ),
        forMember(
          (destination) => destination.status,
          mapFrom((source) => source.status),
        ),
        forMember(
          (destination) => destination.tags,
          mapWithArguments((source, extra) => {
            const includeArray = extra.include
              ? (extra.include as string[])
              : [];

            if (includeArray.includes('tags')) {
              const includeGroupIndex = includeArray.indexOf('tags.group');

              if (includeGroupIndex !== -1) {
                includeArray[includeGroupIndex] = 'group';
              }

              return mapper.mapArray(source.tags, TicketTag, TicketTagDTO, {
                extraArgs: () => ({ ...extra, include: includeArray }),
              });
            }
            return source.tags.map((tag) => tag.id);
          }),
        ),
        forMember(
          (destination) => destination.comments,
          mapWithArguments((source, extra) => {
            const includeArray = extra.include
              ? (extra.include as string[])
              : [];

            return source.comments.map(
              (comment) =>
                new CommentDTO(
                  comment.commentId,
                  comment.timestamp,
                  includeArray.includes('commenter')
                    ? mapper.map(comment.user, User, UserDTO)
                    : comment.user.id,
                  comment.body,
                  comment.changeIndex,
                ),
            );
          }),
        ),
        forMember(
          (destination) => destination.statusChanges,
          mapWithArguments((source, extra) => {
            const includeArray = extra.include
              ? (extra.include as string[])
              : [];

            const shouldIncludeUser = includeArray.includes('historyInitiator');

            return source.statusChanges.map((statusChange) => {
              return new StatusChangeDTO(
                statusChange.statusFrom,
                statusChange.statusTo,
                shouldIncludeUser
                  ? mapper.map(statusChange.user, User, UserDTO)
                  : statusChange.user.id.toString(),
                statusChange.timestamp,
                statusChange.changeIndex,
              );
            });
          }),
        ),
        forMember(
          (destination) => destination.assigneeChanges,
          mapWithArguments((source, extra) => {
            const includeArray = extra.include
              ? (extra.include as string[])
              : [];
            const shouldIncludeUser = includeArray.includes('historyInitiator');
            const shouldIncludeAssignees = includeArray.includes('assignees');

            return source.assigneeChanges.map((assigneeChange) => {
              const added = assigneeChange.after.filter(
                (user) =>
                  !assigneeChange.before.map((a) => a.id).includes(user.id),
              );
              const removed = assigneeChange.before.filter(
                (user) =>
                  !assigneeChange.after.map((a) => a.id).includes(user.id),
              );

              const dto = new AssigneeChangeDTO();
              dto.timestamp = assigneeChange.timestamp;
              dto.user = shouldIncludeUser
                ? mapper.map(assigneeChange.user, User, UserDTO)
                : assigneeChange.user.id;

              dto.added = shouldIncludeAssignees
                ? mapper.mapArray(added, User, UserDTO)
                : added.map(({ id }) => id);

              dto.removed = shouldIncludeAssignees
                ? mapper.mapArray(removed, User, UserDTO)
                : added.map(({ id }) => id);

              return dto;
            });
          }),
        ),
      );
    };
  }
}
