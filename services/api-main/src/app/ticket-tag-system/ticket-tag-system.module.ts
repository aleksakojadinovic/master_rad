import { Module } from '@nestjs/common';
import { TicketTagGroupService } from './ticket-tag-group.service';
import { TicketTagGroupController } from './ticket-tag-group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TicketTagGroup,
  TicketTagGroupSchema,
} from './schema/ticket-tag-group.schema';
import { TicketTag, TicketTagSchema } from './schema/ticket-tag.schema';
import { UsersModule } from '../users/users.module';
import { TicketTagService } from './ticket-tag.service';
import { TicketTagController } from './ticket-tag.controller';
import { TicketTagGroupRepository } from './ticket-tag-group.repository';
import { TicketTagRepository } from './ticket-tag.repository';

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
      { name: TicketTagGroup.name, schema: TicketTagGroupSchema },
    ]),
    MongooseModule.forFeature([
      { name: TicketTag.name, schema: TicketTagSchema },
    ]),
  ],
})
export class TicketTagSystemModule {}
