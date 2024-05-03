import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';
import { TicketsModule } from './app/tickets/tickets.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { UserDTOProfile } from './app/users/infrastructure/profiles/user.dto.profile';
import { TicketDTOProfile } from './app/tickets/api/profiles/ticket.dto.profile';
import { TicketTagEntityProfile } from './app/ticket-tag-system/infrastructure/profiles/ticket-tag.entity.profile';
import { TicketTagGroupDTOProfile } from './app/ticket-tag-system/infrastructure/profiles/ticket-tag-group.dto.profile';
import { TicketTagSystemModule } from './app/ticket-tag-system/ticket-tag-system.module';
import { NotificationsModule } from './app/notifications/notifications.module';
import { NotificationDTOProfile } from './app/notifications/infrastructure/profiles/notification.dto.profile';
import { FirebaseService } from './app/firebase/firebase.service';
import { FirebaseModule } from './app/firebase/firebase.module';
import { UserEntityProfile } from './app/users/infrastructure/profiles/user.entity.profile';
import { TicketEntityProfile } from './app/tickets/api/profiles/ticket.entity.profile';
import { TicketTagGroupEntityProfile } from './app/ticket-tag-system/infrastructure/profiles/ticket-tag-group.entity.profile';
import { NotificationEntityProfile } from './app/notifications/infrastructure/profiles/notification.entity.profile';
import { TicketTagDTOProfile } from './app/ticket-tag-system/infrastructure/profiles/ticket-tag.dto.profile';
import { GenerativeAIModule } from './app/generative-ai/generative-ai.module';

const MAIN_DB_USERNAME = process.env.MAIN_DB_USERNAME;
const MAIN_DB_PWD = process.env.MAIN_DB_PWD;

@Module({
  imports: [
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
    MongooseModule.forRoot(
      `mongodb://${MAIN_DB_USERNAME}:${MAIN_DB_PWD}@maindb:27017/sts_db`,
      { authSource: 'admin', user: MAIN_DB_USERNAME, pass: MAIN_DB_PWD },
    ),
    UsersModule,
    AuthModule,
    TicketsModule,
    TicketTagSystemModule,
    NotificationsModule,
    FirebaseModule,
    GenerativeAIModule,
  ],
  providers: [
    AppService,
    UserEntityProfile,
    UserDTOProfile,
    TicketEntityProfile,
    TicketDTOProfile,
    TicketTagEntityProfile,
    TicketTagDTOProfile,
    TicketTagGroupEntityProfile,
    TicketTagGroupDTOProfile,
    NotificationEntityProfile,
    NotificationDTOProfile,
    FirebaseService,
  ],
})
export class AppModule {}
