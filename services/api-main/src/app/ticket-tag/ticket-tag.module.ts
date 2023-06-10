import { Module } from '@nestjs/common';
import { TicketTagService } from './ticket-tag.service';
import { TicketTagController } from './ticket-tag.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TicketTagGroup,
  TicketTagGroupSchema,
} from './schema/ticket-tag-group.schema';
import { TicketTag, TicketTagSchema } from './schema/ticket-tag.schema';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [TicketTagController],
  providers: [TicketTagService],
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
export class TicketTagModule {}
