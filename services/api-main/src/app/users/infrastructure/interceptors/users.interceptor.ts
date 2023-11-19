import { UsernameTakenError } from './../../domain/errors/UsernameTaken';
import { CannotChangeYourStatusError } from './../../domain/errors/CannotChangeYourStatus';
import {
  CallHandler,
  ConflictException,
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
import { OnlyAdminsCanChangeStatusError } from '../../domain/errors/OnlyAdminsCanChangeStatus';
import { OldPasswordInvalidError } from '../../domain/errors/OldPasswordInvalid';

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

        if (error instanceof OnlyAdminsCanChangeStatusError) {
          throw new ForbiddenException(error.getPayload());
        }

        if (error instanceof CannotChangeYourStatusError) {
          throw new ForbiddenException(error.getPayload());
        }

        if (error instanceof OldPasswordInvalidError) {
          throw new ForbiddenException(error.getPayload());
        }

        if (error instanceof UsernameTakenError) {
          throw new ConflictException(error.getPayload());
        }

        throw error;
      }),
    );
  }
}
