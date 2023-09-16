import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { CannotSearchThisRoleError } from '../../domain/errors/CannotSearchThisRole';
import { CannotChangeYourRoleError } from '../../domain/errors/CannotChangeYourRole';
import { CannotUpdateSomeoneElsesFirebaseTokenError } from '../../domain/errors/CannotUpdateSomeoneElsesFirebaseToken';
import { OnlyAdminsCanChangeRolesError } from '../../domain/errors/OnlyAdminsCanChangeRoles';
import { CannotChangeCustomersRoleError } from '../../domain/errors/CannotChangeCustomersRole';

@Injectable()
export class UsersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof CannotSearchThisRoleError) {
          throw new ForbiddenException(error.getPayload());
        }

        if (error instanceof CannotChangeYourRoleError) {
          throw new ForbiddenException(error.getPayload());
        }

        if (error instanceof OnlyAdminsCanChangeRolesError) {
          throw new ForbiddenException(error.getPayload());
        }

        if (error instanceof CannotChangeCustomersRoleError) {
          throw new ForbiddenException(error.getPayload());
        }

        if (error instanceof CannotUpdateSomeoneElsesFirebaseTokenError) {
          throw new ForbiddenException(error.getPayload());
        }

        throw error;
      }),
    );
  }
}
