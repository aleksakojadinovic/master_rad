import { TicketSummarizePromptFactory } from './factories/ticket-summarize-prompt.factory';
import { Injectable } from '@nestjs/common';
import { TicketNotFoundError as OriginalTicketNotFoundError } from 'src/app/tickets/domain/errors/TicketNotFound';
import { TicketService } from 'src/app/tickets/domain/services/ticket.service';
import { User } from 'src/app/users/domain/entities/user.entity';
import { BaseService } from 'src/codebase/BaseService';
import { TicketNotFoundError } from './errors/TicketNotFound';
import { BadTicketStatusError } from './errors/BadTicketStatus';
import { TicketTooShortError } from './errors/TicketTooShort';
import { TicketTooLongError } from './errors/TicketTooLong';
import OpenAI from 'openai';
import { AIServiceDownError } from './errors/AIServiceDown';

@Injectable()
export class GenerativeAIService extends BaseService {
  constructor(
    private readonly ticketService: TicketService,
    private readonly promptFactory: TicketSummarizePromptFactory,
  ) {
    super();
    try {
      this.openAIAgent = new OpenAI({ apiKey: process.env.OPENAI_KEY });
    } catch (e) {
      console.error('OpenAI agent construction failed with error:', e);
    }
  }

  openAIAgent: OpenAI;

  async summarize(ticketId: string, user: User) {
    try {
      const ticket = await this.ticketService.findOne(ticketId, user);

      if (ticket.isFinalStatus()) {
        throw new BadTicketStatusError();
      }

      if (ticket.comments.length <= 2) {
        throw new TicketTooShortError();
      }

      if (ticket.comments.length > 10) {
        throw new TicketTooLongError();
      }

      const prompt = this.promptFactory.createPrompt(ticket);

      try {
      } catch (e) {
        throw new AIServiceDownError();
      }
    } catch (e) {
      if (e instanceof OriginalTicketNotFoundError) {
        throw new TicketNotFoundError();
      }
      throw e;
    }
  }
}
