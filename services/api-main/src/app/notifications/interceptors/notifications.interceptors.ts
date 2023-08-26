import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { NotificationNotFoundError } from '../errors/NotificationNotFound';

@Injectable()
export class NotificationsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof NotificationNotFoundError) {
          throw new NotFoundException(error.getPayload());
        }
        console.log({ error });
        throw error;
      }),
    );
  }
}
