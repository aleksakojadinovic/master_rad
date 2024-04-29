import { Module } from '@nestjs/common';
import { GenerativeAIService } from './domain/generative-ai.service';
import { UsersModule } from '../users/users.module';
import { TicketsModule } from '../tickets/tickets.module';
import { GenerativeAIController } from './api/generative-ai.controller';

@Module({
  controllers: [GenerativeAIController],
  providers: [GenerativeAIService],
  imports: [UsersModule, TicketsModule],
  exports: [GenerativeAIService],
})
export class GenerativeAIModule {}
