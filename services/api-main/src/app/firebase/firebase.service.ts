import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as firebase from 'firebase-admin';
import { User } from '../users/schema/user.schema';

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
}
