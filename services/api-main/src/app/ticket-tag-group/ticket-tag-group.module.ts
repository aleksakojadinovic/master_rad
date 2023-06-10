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

@Module({
  controllers: [TicketTagGroupController],
  providers: [TicketTagGroupService],
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
export class TicketTagGroupModule {}
