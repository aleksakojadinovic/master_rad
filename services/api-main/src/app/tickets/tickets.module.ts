import { Module } from '@nestjs/common';
import { TicketService } from './domain/services/ticket.service';
import { TicketsController } from './api/tickets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TicketDb,
  TicketSchema,
} from 'src/app/tickets/infrastructure/schema/ticket.schema';
import { UsersModule } from 'src/app/users/users.module';
import { TicketTagSystemModule } from '../ticket-tag-system/ticket-tag-system.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { TicketsRepository } from './infrastructure/tickets.repository';
import { TicketCommentService } from './domain/services/ticket-comment.service';
import { TicketRedactionService } from './domain/services/ticket-redacation.service';
import { TicketTagUpdateService } from './domain/services/ticket-tag-update.service';
import { TicketAssigneesService } from './domain/services/ticket-assignees.service';
import { TicketInfoService } from './domain/services/ticket-info.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TicketDb.name, schema: TicketSchema }]),
    UsersModule,
    TicketTagSystemModule,
    NotificationsModule,
  ],
  exports: [TicketService],
  controllers: [TicketsController],
  providers: [
    TicketService,
    TicketCommentService,
    TicketRedactionService,
    TicketTagUpdateService,
    TicketAssigneesService,
    TicketInfoService,
    TicketsRepository,
  ],
})
export class TicketsModule {}
