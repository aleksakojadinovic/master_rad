import {
  Ticket,
  TicketHistoryEntryBodyChanged,
  TicketHistoryEntryCreated,
  TicketHistoryEntryStatusChange,
  TicketHistoryEntryTitleChanged,
  TicketHistoryEntryType,
  TicketStatus,
} from 'src/schemas/ticket.schema';
import { UserDTO } from 'src/users/dto/user-dto';
export class TicketDTO {
  constructor(
    public id: string,
    public title: string,
    public createdUser: UserDTO,
    public body: string,
    public createdAt: Date,
    public status: string,
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

    const statuses = ticket.history
      .filter(
        (historyEntry) =>
          historyEntry.entryType === TicketHistoryEntryType.STATUS_CHANGED,
      )
      .map(
        (historyEntry) =>
          (historyEntry.entry as TicketHistoryEntryStatusChange).status,
      );
    const titles = [initialTitle].concat(
      ticket.history
        .filter(
          (historyEntry) =>
            historyEntry.entryType === TicketHistoryEntryType.TITLE_CHANGED,
        )
        .map(
          (historyEntry) =>
            (historyEntry.entry as TicketHistoryEntryTitleChanged).title,
        ),
    );

    const bodies = [initialBody].concat(
      ticket.history
        .filter(
          (historyEntry) =>
            historyEntry.entryType === TicketHistoryEntryType.BODY_CHANGED,
        )
        .map(
          (historyEntry) =>
            (historyEntry.entry as TicketHistoryEntryBodyChanged).body,
        ),
    );

    const title = titles[titles.length - 1];
    const body = bodies[bodies.length - 1];
    const status =
      statuses.length > 0 ? statuses[statuses.length - 1] : TicketStatus.NEW;

    return new TicketDTO(
      ticket._id,
      title,
      new UserDTO(
        initialItem.initiator._id,
        initialItem.initiator.username,
        initialItem.initiator.firstName,
        initialItem.initiator.lastName,
        initialItem.initiator.roles.map(({ name }) => name),
      ),
      body,
      dateCreated,
      status.toString(),
    );
  }
}
