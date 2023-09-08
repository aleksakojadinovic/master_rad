import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';
import { TicketsModule } from './app/tickets/tickets.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { UserDTOProfile } from './app/users/infrastructure/profiles/user.dto.profile';
import { TicketProfile } from './app/tickets/api/profiles/ticket.profile';
import { TicketHistoryItemProfile } from './app/tickets/api/profiles/ticket-history.profile';
import { TicketTagDTOProfile } from './app/ticket-tag-system/infrastructure/profiles/ticket-tag.dto.profile';
import { TicketTagGroupDTOProfile } from './app/ticket-tag-system/infrastructure/profiles/ticket-tag-group.dto.profile';
import { TicketTagSystemModule } from './app/ticket-tag-system/ticket-tag-system.module';
import { NotificationsModule } from './app/notifications/notifications.module';
import { NotificationProfile } from './app/notifications/profiles/notification.profile';
import { FirebaseService } from './app/firebase/firebase.service';
import { FirebaseModule } from './app/firebase/firebase.module';

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
  ],
  providers: [
    AppService,
    UserDTOProfile,
    TicketProfile,
    TicketHistoryItemProfile,
    TicketTagDTOProfile,
    TicketTagGroupDTOProfile,
    NotificationProfile,
    FirebaseService,
  ],
})
export class AppModule {}
