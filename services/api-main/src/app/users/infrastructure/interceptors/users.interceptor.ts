import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { CannotSearchThisRoleError } from '../../domain/errors/CannotSearchThisRole';

@Injectable()
export class UsersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof CannotSearchThisRoleError) {
          throw new ForbiddenException(error.getPayload());
        }

        throw error;
      }),
    );
  }
}
