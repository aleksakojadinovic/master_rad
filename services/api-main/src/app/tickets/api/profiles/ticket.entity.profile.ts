import {
  TicketHistoryEntryAssigneesChanged,
  TicketHistoryEntryBodyChanged,
  TicketHistoryEntryCommentAdded,
  TicketHistoryEntryCreated,
  TicketHistoryEntryStatusChanged,
  TicketHistoryEntryTagsChanged,
  TicketHistoryEntryTitleChanged,
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

// TODO maybe rewrite this so that it uses completely custom mapping
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
          mapFrom((source) => {
            return mapper.map(
              source.history.find(
                (item) => item.type === TicketHistoryEntryType.CREATED,
              ).initiator,
              UserDb,
              User,
            );
          }),
        ),
        forMember(
          (destination) => destination.assignees,
          mapFrom((source) => {
            const items = source.history.filter(
              (item) => item.type === TicketHistoryEntryType.ASSIGNEES_CHANGED,
            );

            if (items.length === 0) {
              return [];
            }

            const lastChange = items[items.length - 1]
              .payload as TicketHistoryEntryAssigneesChanged;
            return mapper.mapArray(lastChange.assignees, UserDb, User);
          }),
        ),
        forMember(
          (destination) => destination.createdAt,
          mapFrom((source) => {
            const initialEntry = source.history.find(
              (item) => item.type === TicketHistoryEntryType.CREATED,
            );
            return initialEntry.timestamp;
          }),
        ),
        forMember(
          (destination) => destination.title,
          mapFrom((source) => {
            const initialEntry = source.history.find(
              (item) => item.type === TicketHistoryEntryType.CREATED,
            );
            const titleChangeEntries = source.history.filter(
              (item) => item.type === TicketHistoryEntryType.TITLE_CHANGED,
            );

            if (titleChangeEntries.length === 0) {
              return (initialEntry.payload as TicketHistoryEntryCreated).title;
            }

            return (
              titleChangeEntries[titleChangeEntries.length - 1]
                .payload as TicketHistoryEntryTitleChanged
            ).title;
          }),
        ),
        forMember(
          (destination) => destination.body,
          mapFrom((source) => {
            const initialEntry = source.history.find(
              (item) => item.type === TicketHistoryEntryType.CREATED,
            );
            const bodyChangeEntries = source.history.filter(
              (item) => item.type === TicketHistoryEntryType.BODY_CHANGED,
            );

            if (bodyChangeEntries.length === 0) {
              return (initialEntry.payload as TicketHistoryEntryCreated).body;
            }

            return (
              bodyChangeEntries[bodyChangeEntries.length - 1]
                .payload as TicketHistoryEntryBodyChanged
            ).body;
          }),
        ),
        forMember(
          (destination) => destination.status,
          mapFrom((source) => {
            const initialEntry = source.history.find(
              (item) => item.type === TicketHistoryEntryType.CREATED,
            );

            const statusChangeEntries = source.history.filter(
              (item) => item.type === TicketHistoryEntryType.STATUS_CHANGED,
            );

            if (statusChangeEntries.length === 0) {
              return (initialEntry.payload as TicketHistoryEntryCreated).status;
            }

            return (
              statusChangeEntries[statusChangeEntries.length - 1]
                .payload as TicketHistoryEntryStatusChanged
            ).status;
          }),
        ),
        forMember(
          (destination) => destination.tags,
          mapFrom((source) => {
            const tagChangeItems = source.history.filter(
              (item) => item.type === TicketHistoryEntryType.TAGS_CHANGED,
            );

            if (tagChangeItems.length === 0) {
              return [];
            }

            const tags = (
              tagChangeItems[tagChangeItems.length - 1]
                .payload as TicketHistoryEntryTagsChanged
            ).tags;

            return mapper.mapArray(tags, TicketTagDb, TicketTag);
          }),
        ),
        forMember(
          (destination) => destination.comments,
          mapFrom((source) => {
            const commentItems = source.history
              .map((item, index) => ({ item, index }))
              .filter(
                ({ item }) =>
                  item.type === TicketHistoryEntryType.COMMEND_ADDED,
              );

            if (commentItems.length === 0) {
              return [];
            }

            return commentItems.map(({ item, index }) => {
              const comment = new TicketComment();
              const payload = item.payload as TicketHistoryEntryCommentAdded;
              comment.changeIndex = index;
              comment.body = payload.body;
              comment.commentId = payload.commentId;
              comment.isInternal = payload.isInternal;
              return comment;
            });
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
                statusChange.statusFrom =
                  changeIndex === 0
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
      );
    };
  }
}
