import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  MappingProfile,
  createMap,
  forMember,
  mapFrom,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Ticket } from '../schema/ticket.schema';
import {
  TicketHistoryEntryStatusChange,
  TicketHistoryEntryTitleChanged,
} from '../schema/ticket-history.schema';
import { TicketState } from '../schema/ticket-state.schema';
import { TicketHistoryEntryType, TicketStatus } from '../types';

@Injectable()
export class TicketToTicketStateProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        Ticket,
        TicketState,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source._id),
        ),
        forMember(
          (destination) => destination.title,
          mapFrom((source) => {
            const titles = source.history
              .filter(
                (item) =>
                  item.entryType === TicketHistoryEntryType.TITLE_CHANGED,
              )
              .map((item) => item.entry as TicketHistoryEntryTitleChanged)
              .map((entry) => entry.title);
            return titles[titles.length - 1];
          }),
        ),
        forMember(
          (destination) => destination.createdAt,
          mapFrom((source) => {
            const createdEntry = source.history.find(
              (item) => item.entryType === TicketHistoryEntryType.CREATED,
            );
            return createdEntry.timestamp;
          }),
        ),
        forMember(
          (destination) => destination.createdBy,
          mapFrom((source) => {
            const createdEntry = source.history.find(
              (item) => item.entryType === TicketHistoryEntryType.CREATED,
            );
            return createdEntry.initiator;
          }),
        ),
        forMember(
          (destination) => destination.status,
          mapFrom((source) => {
            const statusEntries = source.history
              .filter(
                (item) =>
                  item.entryType === TicketHistoryEntryType.STATUS_CHANGED,
              )
              .map((item) => item.entry as TicketHistoryEntryStatusChange);
            return statusEntries.length > 0
              ? statusEntries[statusEntries.length - 1].status
              : TicketStatus.NEW;
          }),
        ),
      );
    };
  }
}
