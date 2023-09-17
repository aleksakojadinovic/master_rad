import { Module } from '@nestjs/common';
import { TicketsService } from './domain/services/tickets.service';
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
import { TicketsCommentService } from './domain/services/ticket-comment.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TicketDb.name, schema: TicketSchema }]),
    UsersModule,
    TicketTagSystemModule,
    NotificationsModule,
  ],

  controllers: [TicketsController],
  providers: [TicketsService, TicketsCommentService, TicketsRepository],
})
export class TicketsModule {}
