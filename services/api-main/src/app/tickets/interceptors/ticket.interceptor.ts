import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { TicketNotFoundError } from '../errors/TicketNotFound';
import { TicketIdNotValidError } from '../errors/TicketIdNotValid';
import { AssigneeIdNotValidError } from '../errors/AssigneeIdNotValid';
import { CannotAssignCustomer } from '../errors/CannotAssignCustomer';
import { TooSoonToCreateAnotherTicket } from '../errors/TooSoonToCreateAnotherTicket';

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

        if (error instanceof AssigneeIdNotValidError) {
          throw new BadRequestException(error.message);
        }

        if (error instanceof CannotAssignCustomer) {
          throw new BadRequestException(error.message);
        }

        if (error instanceof TooSoonToCreateAnotherTicket) {
          throw new BadRequestException(error.message);
        }

        throw error;
      }),
    );
  }
}
