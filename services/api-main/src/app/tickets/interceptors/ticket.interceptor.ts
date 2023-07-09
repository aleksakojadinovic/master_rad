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
import { TooSoonToCreateAnotherTicketError } from '../errors/TooSoonToCreateAnotherTicket';

@Injectable()
export class TicketInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof TicketNotFoundError) {
          throw new NotFoundException(error.getPayload());
        }

        if (error instanceof TicketIdNotValidError) {
          throw new BadRequestException(error.getPayload());
        }

        if (error instanceof AssigneeIdNotValidError) {
          throw new BadRequestException(error.getPayload());
        }

        if (error instanceof CannotAssignCustomer) {
          throw new BadRequestException(error.getPayload());
        }

        if (error instanceof TooSoonToCreateAnotherTicketError) {
          throw new BadRequestException(error.getPayload());
        }

        throw error;
      }),
    );
  }
}
