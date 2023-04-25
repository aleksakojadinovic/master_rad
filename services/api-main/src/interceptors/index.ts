import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { ServiceErrors } from 'src/errors';

@Injectable()
export class ServiceErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((value) => {
        // TODO: rework this
        if (value.error == null) {
          return;
        }
        const errorCode = value.error.type as ServiceErrors;
        if (errorCode === ServiceErrors.ENTITY_NOT_FOUND) {
          throw new NotFoundException(value);
        }

        if (errorCode === ServiceErrors.VALIDATION_FAILED) {
          throw new BadRequestException(value);
        }
      }),
    );
  }
}
