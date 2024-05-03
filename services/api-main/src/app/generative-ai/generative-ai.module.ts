import { Module } from '@nestjs/common';
import { GenerativeAIService } from './domain/generative-ai.service';
import { UsersModule } from '../users/users.module';
import { TicketsModule } from '../tickets/tickets.module';
import { GenerativeAIController } from './api/generative-ai.controller';
import { TicketSummarizePromptFactory } from './domain/factories/ticket-summarize-prompt.factory';

@Module({
  controllers: [GenerativeAIController],
  providers: [GenerativeAIService, TicketSummarizePromptFactory],
  imports: [UsersModule, TicketsModule],
  exports: [GenerativeAIService],
})
export class GenerativeAIModule {}
