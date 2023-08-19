import { Module } from '@nestjs/common';

import * as firebase from 'firebase-admin';

import { readFileSync } from 'fs';

@Module({})
export class FirebaseModule {
  private isInitialized = false;

  constructor() {
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
}
