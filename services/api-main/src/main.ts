import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { GlobalInterceptor } from './codebase/interceptors/global.interceptor';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        throw new BadRequestException({
          message: 'Validation failed',
          validation: errors,
        });
      },
    }),
  );
  app.useGlobalInterceptors(new GlobalInterceptor());
  await app.listen(3000);
}
bootstrap();
