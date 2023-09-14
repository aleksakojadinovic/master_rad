import { Module } from '@nestjs/common';
import { NotificationsService } from './domain/notifications.service';
import { NotificationsController } from './api/notifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotificationDb,
  NotificationSchema,
} from './infrastructure/schema/notification.schema';
import { UsersModule } from '../users/users.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { NotificationsRepository } from './infrastructure/notifications.repository';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsRepository],
  imports: [
    MongooseModule.forFeature([
      {
        name: NotificationDb.name,
        schema: NotificationSchema,
      },
    ]),
    UsersModule,
    FirebaseModule,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
