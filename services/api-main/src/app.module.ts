import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

const MAIN_DB_USERNAME = process.env.MAIN_DB_USERNAME;
const MAIN_DB_PWD = process.env.MAIN_DB_PWD;

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${MAIN_DB_USERNAME}:${MAIN_DB_PWD}@maindb:27017/sts_db`,
      { authSource: 'admin', user: MAIN_DB_USERNAME, pass: MAIN_DB_PWD },
    ),
    UsersModule,
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
