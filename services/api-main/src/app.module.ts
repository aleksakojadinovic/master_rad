import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';
import { TicketsModule } from './app/tickets/tickets.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { UserProfile } from './app/users/profiles/user.profile';
import { RoleProfile } from './app/users/profiles/role.profile';
import { TicketProfile } from './app/tickets/profiles/ticket.profile';
import { TicketHistoryItemProfile } from './app/tickets/profiles/ticket-history.profile';
import { TicketTagModule } from './app/ticket-tag/ticket-tag.module';

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
    TicketTagModule,
  ],
  providers: [
    AppService,
    RoleProfile,
    UserProfile,
    TicketProfile,
    TicketHistoryItemProfile,
  ],
})
export class AppModule {}
