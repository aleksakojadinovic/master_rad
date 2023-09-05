import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { TicketNotFoundError } from '../errors/TicketNotFound';
import { TicketIdNotValidError } from '../errors/TicketIdNotValid';
import { AssigneeIdNotValidError } from '../errors/AssigneeIdNotValid';
import { CannotAssignCustomerError } from '../errors/CannotAssignCustomer';
import { TooSoonToCreateAnotherTicketError } from '../errors/TooSoonToCreateAnotherTicket';
import { NotAllowedToAddThisTagError } from '../errors/NotAllowedToAddThisTag';
import { NotAllowedToRemoveThisTagError } from '../errors/NotAllowedToRemoveThisTag';
import { DuplicateTagError } from '../errors/DuplicateTag';
import { DuplicateAssigneeError } from '../errors/DuplicateAssignee';
import { NotAllowedToChangeToThisStatusError } from '../errors/NotAllowedToChangeToThisStatus';
import { CustomerCannotAddInternalCommmentError } from '../errors/CustomerCannotAddInternalComment';
import { NotAllowedToSearchOthersTicketsAsACustomerError } from '../errors/NotAllowedToSearchOthersTicketsAsACustomer';

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

        if (error instanceof CannotAssignCustomerError) {
          throw new BadRequestException(error.getPayload());
        }

        if (error instanceof TooSoonToCreateAnotherTicketError) {
          throw new BadRequestException(error.getPayload());
        }

        if (error instanceof NotAllowedToAddThisTagError) {
          throw new ForbiddenException(error.getPayload());
        }

        if (error instanceof NotAllowedToRemoveThisTagError) {
          throw new ForbiddenException(error.getPayload());
        }

        if (error instanceof DuplicateTagError) {
          throw new ConflictException(error.getPayload());
        }

        if (error instanceof DuplicateAssigneeError) {
          throw new ConflictException(error.getPayload());
        }

        if (error instanceof NotAllowedToChangeToThisStatusError) {
          throw new ForbiddenException(error.getPayload());
        }

        if (error instanceof CustomerCannotAddInternalCommmentError) {
          throw new ForbiddenException(error.getPayload());
        }

        if (error instanceof NotAllowedToSearchOthersTicketsAsACustomerError) {
          throw new ForbiddenException(error.getPayload());
        }

        throw error;
      }),
    );
  }
}
