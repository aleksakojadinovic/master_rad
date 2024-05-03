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
import { AISummary } from './value-objects/AISummary';
import { NotAllowedToUseAIError } from './errors/NotAllowedToUseAI';

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

  async summarize(ticketId: string, user: User): Promise<AISummary> {
    if (!user.canUseAI) {
      throw new NotAllowedToUseAIError();
    }

    try {
      const ticket = await this.ticketService.findOne(ticketId, user);

      if (ticket.isFinalStatus()) {
        throw new BadTicketStatusError();
      }

      if (ticket.comments.length < 2) {
        throw new TicketTooShortError();
      }

      if (ticket.comments.length > 10) {
        throw new TicketTooLongError();
      }

      const prompt = this.promptFactory.createPrompt(ticket);

      try {
        const response = await this.openAIAgent.chat.completions.create({
          messages: [{ role: 'system', content: prompt }],
          model: 'gpt-3.5-turbo',
        });

        const message = response.choices[0].message.content;
        const summary = new AISummary(message);
        return summary;

        // const message = 'This is my AI response for prompt' + prompt;
        // return new AISummary(message);
      } catch (e) {
        console.error('AI service error:', e);
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
