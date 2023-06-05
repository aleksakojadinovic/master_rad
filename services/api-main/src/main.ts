import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { GlobalInterceptor } from './codebase/interceptors/global.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.use(cookieParser());
  app.useGlobalInterceptors(new GlobalInterceptor());
  await app.listen(3000);
}
bootstrap();
