import { Module } from '@nestjs/common';
import { TicketTagGroupService } from './domain/services/ticket-tag-group.service';
import { TicketTagGroupController } from './api/controllers/ticket-tag-group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TicketTagGroupDb,
  TicketTagGroupSchema,
} from './infrastructure/schema/ticket-tag-group.schema';
import {
  TicketTagDb,
  TicketTagSchema,
} from './infrastructure/schema/ticket-tag.schema';
import { UsersModule } from '../users/users.module';
import { TicketTagService } from './domain/services/ticket-tag.service';
import { TicketTagController } from './api/controllers/ticket-tag.controller';
import { TicketTagGroupRepository } from './infrastructure/repositories/ticket-tag-group.repository';
import { TicketTagRepository } from './infrastructure/repositories/ticket-tag.repository';

@Module({
  controllers: [TicketTagGroupController, TicketTagController],
  providers: [
    TicketTagGroupService,
    TicketTagService,
    TicketTagGroupRepository,
    TicketTagRepository,
  ],
  exports: [TicketTagService],
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: TicketTagGroupDb.name, schema: TicketTagGroupSchema },
    ]),
    MongooseModule.forFeature([
      { name: TicketTagDb.name, schema: TicketTagSchema },
    ]),
  ],
})
export class TicketTagSystemModule {}
