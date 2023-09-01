import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './schema/notification.schema';
import { UsersModule } from '../users/users.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { NotificationsRepository } from './notifications.repository';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsRepository],
  imports: [
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
    UsersModule,
    FirebaseModule,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
