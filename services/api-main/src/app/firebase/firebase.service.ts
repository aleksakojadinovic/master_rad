import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as firebase from 'firebase-admin';
import { User } from '../users/schema/user.schema';
import { Notification } from '../notifications/schema/notification.schema';

@Injectable()
export class FirebaseService {
  private isInitialized = false;
  constructor() {
    if (firebase.apps.length > 0) {
      this.isInitialized = true;
      return;
    }
    try {
      const key = JSON.parse(
        readFileSync(process.env.FIREBASE_KEY_PATH, 'utf8'),
      );

      firebase.initializeApp({
        credential: firebase.credential.cert(key),
      });
      this.isInitialized = true;
    } catch (e) {
      console.log(`Error initializing firebase`, { e });
    }
  }

  async notifyTokens(...tokens: string[]) {
    if (!this.isInitialized) {
      return;
    }
    await firebase.messaging().sendEachForMulticast({
      tokens,
      data: {},
      notification: { title: 'Testing' },
    });
  }

  notifyUsers(users: User[]) {
    if (!this.isInitialized) {
      return;
    }
    const tokens = users.map((user) => user.firebaseTokens).flat();
    return this.notifyTokens(...tokens);
  }

  parseNotificationType(type: string) {
    return type
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
  }

  async sendNotification(notification: Notification) {
    const title = this.parseNotificationType(notification.type);

    if (notification.user.firebaseTokens.length == 0) {
      return Promise.resolve();
    }

    return firebase.messaging().sendEachForMulticast({
      tokens: notification.user.firebaseTokens,
      data: {},
      notification: {
        title,
      },
    });
  }

  async sendNotifications(...notifications: Notification[]) {
    if (!this.isInitialized) {
      return;
    }
    try {
      await Promise.all(
        notifications.map((notification) =>
          this.sendNotification(notification),
        ),
      );
    } catch (e) {
      console.log(e);
    }
  }
}
