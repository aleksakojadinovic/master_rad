import {
  Ticket,
  TicketHistoryEntryBodyChanged,
  TicketHistoryEntryCreated,
  TicketHistoryEntryTitleChanged,
  TicketHistoryEntryType,
} from 'src/schemas/ticket.schema';
export class TicketDTO {
  constructor(
    public id: string,
    public title: string,
    public body: string,
    public createdAt: Date,
    public status: string,
  ) {}

  static mapFromModel(ticket: Ticket): TicketDTO {
    const initialTitle = (ticket.history[0].entry as TicketHistoryEntryCreated)
      .title;

    const initialBody = (ticket.history[0].entry as TicketHistoryEntryCreated)
      .body;

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
    return new TicketDTO(ticket._id, title, body, new Date(), '');
  }
}
