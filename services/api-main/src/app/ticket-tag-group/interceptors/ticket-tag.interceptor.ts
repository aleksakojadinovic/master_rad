import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { TicketTagGroupNotFoundError } from '../errors/TicketTagGroupNotFound';
import { TicketTagNameAlreadyExistsError } from '../errors/TicketTagNameAlreadyExists';

@Injectable()
export class TicketTagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof TicketTagGroupNotFoundError) {
          throw new NotFoundException(error.message);
        }

        if (error instanceof TicketTagNameAlreadyExistsError) {
          throw new BadRequestException(error.message);
        }

        throw error;
      }),
    );
  }
}
