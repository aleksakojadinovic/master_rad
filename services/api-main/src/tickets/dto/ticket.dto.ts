import { Ticket } from 'src/schemas/ticket.schema';
export class TicketDTO {
  constructor(
    public id: string,
    public title: string,
    public body: string,
    public createdAt: Date,
    public status: string,
  ) {}

  //   static mapFromModel(ticket: Ticket): TicketDTO {
  //     // const titles = ticket.
  //   }
}
