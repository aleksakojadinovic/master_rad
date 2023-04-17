import {
  Ticket,
  TicketHistoryEntryBodyChanged,
  TicketHistoryEntryCommentAdded,
  TicketHistoryEntryCreated,
  TicketHistoryEntryStatusChange,
  TicketHistoryEntryTitleChanged,
  TicketHistoryEntryType,
  TicketStatus,
} from 'src/schemas/ticket.schema';
import { UserDTO } from 'src/users/dto/user-dto';

class CommentDTO {
  constructor(
    public user: UserDTO,
    public timestamp: Date,
    public body: string,
    public index: number,
  ) {}
}

class StatusChangeDTO {
  constructor(
    public statusFrom: TicketStatus,
    public statusTo: TicketStatus,
    public timestamp: Date,
    public user: UserDTO,
    public index: number,
  ) {}
}

export class TicketDTO {
  constructor(
    public id: string,
    public title: string,
    public createdUser: UserDTO,
    public body: string,
    public createdAt: Date,
    public status: string,
    public comments: CommentDTO[],
    public statusChanges: StatusChangeDTO[],
  ) {}

  static mapFromModel(ticket: Ticket): TicketDTO {
    if (ticket.history.length === 0) {
      throw new Error(
        `Found a ticket with no history entries, id: ${ticket._id}`,
      );
    }

    const initialItem = ticket.history[0];
    const initialEntry = ticket.history[0].entry as TicketHistoryEntryCreated;

    const initialTitle = initialEntry.title;
    const initialBody = initialEntry.body;
    const dateCreated = ticket.history[0].timestamp;

    const statusItemsAndIndices = ticket.history
      .map((item, index) => ({ item, index }))
      .filter(
        ({ item }) => item.entryType === TicketHistoryEntryType.STATUS_CHANGED,
      );

    console.log({ statusItems: statusItemsAndIndices });

    const statusChanges = statusItemsAndIndices.map(
      ({ item, index }, arrayIndex) => {
        const entry = item.entry as TicketHistoryEntryStatusChange;
        const previous =
          arrayIndex > 0
            ? (
                statusItemsAndIndices[arrayIndex - 1].item
                  .entry as TicketHistoryEntryStatusChange
              ).status
            : TicketStatus.NEW;

        return new StatusChangeDTO(
          previous,
          entry.status,
          item.timestamp,
          UserDTO.mapFromModel(item.initiator),
          index,
        );
      },
    );

    const titles = [initialTitle].concat(
      ticket.history
        .filter(
          (item) => item.entryType === TicketHistoryEntryType.TITLE_CHANGED,
        )
        .map((item) => (item.entry as TicketHistoryEntryTitleChanged).title),
    );

    const bodies = [initialBody].concat(
      ticket.history
        .filter(
          (item) => item.entryType === TicketHistoryEntryType.BODY_CHANGED,
        )
        .map((item) => (item.entry as TicketHistoryEntryBodyChanged).body),
    );

    const commentItems = ticket.history
      .map((item, index) => ({ item, index }))
      .filter(
        ({ item }) => item.entryType === TicketHistoryEntryType.COMMEND_ADDED,
      )
      .map(({ item, index }) => ({
        entry: item.entry as TicketHistoryEntryCommentAdded,
        user: item.initiator,
        timestamp: item.timestamp,
        index,
      }))
      .map(
        ({ user, entry, timestamp, index }) =>
          new CommentDTO(
            UserDTO.mapFromModel(user),
            timestamp,
            entry.body,
            index,
          ),
      );

    const title = titles[titles.length - 1];
    const body = bodies[bodies.length - 1];
    const status =
      statusItemsAndIndices.length > 0
        ? (
            statusItemsAndIndices[statusItemsAndIndices.length - 1].item
              .entry as TicketHistoryEntryStatusChange
          ).status
        : TicketStatus.NEW;

    return new TicketDTO(
      ticket._id,
      title,
      UserDTO.mapFromModel(initialItem.initiator),
      body,
      dateCreated,
      status.toString(),
      commentItems,
      statusChanges,
    );
  }
}
