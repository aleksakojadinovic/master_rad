import { Module } from '@nestjs/common';
import { TicketTagService } from './ticket-tag.service';
import { TicketTagController } from './ticket-tag.controller';

@Module({
  controllers: [TicketTagController],
  providers: [TicketTagService],
})
export class TicketTagModule {}
