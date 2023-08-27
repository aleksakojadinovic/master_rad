import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';

@Module({
  controllers: [FirebaseController],
  exports: [FirebaseService],
  providers: [FirebaseService],
})
export class FirebaseModule {}
