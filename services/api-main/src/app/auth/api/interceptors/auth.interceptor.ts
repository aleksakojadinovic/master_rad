import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { UsernameOrPasswordNotValidError } from '../../domain/errors/UsernameOrPasswordNotValid';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof UsernameOrPasswordNotValidError) {
          throw new ForbiddenException(error.getPayload());
        }

        throw error;
      }),
    );
  }
}
