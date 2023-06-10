import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { InvalidPaginationParametersError } from '../errors/InvalidPaginationParameters';
import { PaginationRequiredError } from '../errors/PaginationRequired';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof InvalidPaginationParametersError) {
          throw new BadRequestException(error.message);
        }

        if (error instanceof PaginationRequiredError) {
          throw new BadRequestException(error.message);
        }

        throw error;
      }),
    );
  }
}
