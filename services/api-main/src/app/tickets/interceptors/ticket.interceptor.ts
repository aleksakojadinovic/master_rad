import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { TicketNotFoundError } from '../errors/TicketNotFound';
import { TicketIdNotValidError } from '../errors/TicketIdNotValid';

@Injectable()
export class TicketInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof TicketNotFoundError) {
          throw new NotFoundException(error.message);
        }

        if (error instanceof TicketIdNotValidError) {
          throw new BadRequestException(error.message);
        }

        throw new InternalServerErrorException('Something went wrong.');
      }),
    );
  }
}
