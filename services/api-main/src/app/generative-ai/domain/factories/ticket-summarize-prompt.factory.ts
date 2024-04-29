import { Injectable } from '@nestjs/common';
import { Ticket } from 'src/app/tickets/domain/entities/ticket.entity';

@Injectable()
export class TicketSummarizePromptFactory {
  createPrompt(ticket: Ticket) {
    return 'This is a prompt for ticket ' + ticket.title;
  }
}
