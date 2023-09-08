import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { NotificationNotFoundError } from '../../domain/errors/NotificationNotFound';

@Injectable()
export class NotificationsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof NotificationNotFoundError) {
          throw new NotFoundException(error.getPayload());
        }
        throw error;
      }),
    );
  }
}
