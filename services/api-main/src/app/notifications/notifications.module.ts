import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './schema/notification.schema';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
    UsersModule,
  ],
})
export class NotificationsModule {}
