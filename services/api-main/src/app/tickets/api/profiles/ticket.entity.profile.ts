import {
  TicketHistoryEntryAssigneesChanged,
  TicketHistoryEntryCommentAdded,
  TicketHistoryEntryCommentChanged,
  TicketHistoryEntryCreated,
  TicketHistoryEntryStatusChanged,
} from './../../infrastructure/schema/ticket-history.schema';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Ticket } from '../../domain/entities/ticket.entity';
import { User } from 'src/app/users/domain/entities/user.entity';
import { TicketTag } from 'src/app/ticket-tag-system/domain/entities/ticket-tag.entity';
import { TicketDb } from '../../infrastructure/schema/ticket.schema';
import { TicketHistoryEntryType } from '../../infrastructure/schema/ticket-history.schema';
import { UserDb } from 'src/app/users/infrastructure/schema/user.schema';
import { TicketTagDb } from 'src/app/ticket-tag-system/infrastructure/schema/ticket-tag.schema';
import { TicketComment } from '../../domain/value-objects/ticket-comment';
import { TicketStatusChange } from '../../domain/value-objects/ticket-status-change';
import { TicketAssigneeChange } from '../../domain/value-objects/ticket-assignee-change';

@Injectable()
export class TicketEntityProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        TicketDb,
        Ticket,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source._id),
        ),
        forMember(
          (destination) => destination.createdBy,
          mapFrom((source) => mapper.map(source.createdBy, UserDb, User)),
        ),
        forMember(
          (destination) => destination.assignees,
          mapFrom((source) => mapper.mapArray(source.assignees, UserDb, User)),
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
          mapFrom((source) =>
            mapper.mapArray(source.tags, TicketTagDb, TicketTag),
          ),
        ),
        forMember(
          (destination) => destination.comments,
          mapFrom((source) => {
            const commentItems = source.history.filter(
              (item) => item.type === TicketHistoryEntryType.COMMENT_ADDED,
            );

            if (commentItems.length === 0) {
              return [];
            }

            return commentItems
              .map((item) => {
                const payload = item.payload as TicketHistoryEntryCommentAdded;

                const deletes = source.history.filter(
                  (deleteItem) =>
                    deleteItem.type ===
                      TicketHistoryEntryType.COMMENT_DELETED &&
                    (deleteItem.payload as TicketHistoryEntryCommentChanged)
                      .commentId === payload.commentId,
                );

                const wasDeleted = deletes.length > 0;

                if (wasDeleted) {
                  return null;
                }

                const changes = source.history.filter(
                  (changeItem) =>
                    changeItem.type ===
                      TicketHistoryEntryType.COMMENT_CHANGED &&
                    (changeItem.payload as TicketHistoryEntryCommentChanged)
                      .commentId === payload.commentId,
                );

                const comment = new TicketComment();

                const lastChange =
                  changes.length > 0 ? changes[changes.length - 1] : null;

                const lastChangePayload = lastChange
                  ? (lastChange.payload as TicketHistoryEntryCommentChanged)
                  : null;

                comment.body = lastChange
                  ? lastChangePayload.body
                  : payload.body;
                comment.commentId = payload.commentId;
                comment.isInternal = payload.isInternal;
                comment.user = mapper.map(item.initiator, UserDb, User);
                comment.timestamp = item.timestamp;
                comment.dateUpdated = lastChange ? lastChange.timestamp : null;
                return comment;
              })
              .filter((comment) => !!comment);
          }),
        ),
        forMember(
          (destination) => destination.statusChanges,
          mapFrom((source) => {
            const initialEntry = source.history.find(
              (item) => item.type === TicketHistoryEntryType.CREATED,
            );

            const statusChangeEntries = source.history
              .map((item, index) => ({ item, index }))
              .filter(
                ({ item }) =>
                  item.type === TicketHistoryEntryType.STATUS_CHANGED,
              );

            return statusChangeEntries.map(
              ({ item, index: changeIndex }, index) => {
                const statusChange = new TicketStatusChange();
                statusChange.changeIndex = changeIndex;
                statusChange.timestamp = item.timestamp;
                statusChange.statusFrom =
                  index === 0
                    ? (initialEntry.payload as TicketHistoryEntryCreated).status
                    : (
                        statusChangeEntries[index - 1].item
                          .payload as TicketHistoryEntryStatusChanged
                      ).status;

                statusChange.statusTo = (
                  item.payload as TicketHistoryEntryStatusChanged
                ).status;

                statusChange.user = mapper.map(item.initiator, UserDb, User);

                return statusChange;
              },
            );
          }),
        ),
        forMember(
          (destination) => destination.assigneeChanges,
          mapFrom((source) => {
            const assigneeChangeEntries = source.history
              .map((item, index) => ({ item, index }))
              .filter(
                ({ item }) =>
                  item.type === TicketHistoryEntryType.ASSIGNEES_CHANGED,
              );

            return assigneeChangeEntries.map(({ item }, index) => {
              const assigneeChange = new TicketAssigneeChange();
              assigneeChange.before =
                index === 0
                  ? []
                  : mapper.mapArray(
                      (
                        assigneeChangeEntries[index - 1].item
                          .payload as TicketHistoryEntryAssigneesChanged
                      ).assignees,
                      UserDb,
                      User,
                    );

              assigneeChange.after = mapper.mapArray(
                (item.payload as TicketHistoryEntryAssigneesChanged).assignees,
                UserDb,
                User,
              );

              assigneeChange.timestamp = item.timestamp;
              assigneeChange.user = mapper.map(item.initiator, UserDb, User);

              return assigneeChange;
            });
          }),
        ),
      );
    };
  }
}
