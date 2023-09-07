import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Ticket,
  TicketSchema,
} from 'src/app/tickets/infrastructure/schema/ticket.schema';
import { UsersModule } from 'src/app/users/users.module';
import { TicketTagSystemModule } from '../ticket-tag-system/ticket-tag-system.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { TicketsRepository } from './infrastructure/tickets.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    UsersModule,
    TicketTagSystemModule,
    NotificationsModule,
  ],

  controllers: [TicketsController],
  providers: [TicketsService, TicketsRepository],
})
export class TicketsModule {}
