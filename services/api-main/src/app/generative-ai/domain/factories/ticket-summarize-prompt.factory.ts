import { Injectable } from '@nestjs/common';
import { Ticket } from 'src/app/tickets/domain/entities/ticket.entity';

@Injectable()
export class TicketSummarizePromptFactory {
  createPrompt(ticket: Ticket) {
    const context =
      'Summarize the following support ticket. Adjust your language based on the input language. If lorem ipsum reply with lorem ispum. Write only summary and nothing else, 100 chars max.';
    const customerName = ticket.createdBy.fullName;
    const body = ticket.body;
    const comments = ticket.comments
      .map((comment) => `Comment by ${comment.user.fullName}: ${comment.body}`)
      .join(',');

    const prompt = `${context}Customer=${customerName}.Body=${body}.Comments=${comments}`;
    return prompt;
  }
}
