import { CannotChangeCommentsForTicketStatus } from './../../domain/errors/CannotChangeCommentsOfAClosedTicket';
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
import { TicketNotFoundError } from '../../domain/errors/TicketNotFound';
import { TicketIdNotValidError } from '../../domain/errors/TicketIdNotValid';
import { AssigneeIdNotValidError } from '../../domain/errors/AssigneeIdNotValid';
import { CannotAssignCustomerError } from '../../domain/errors/CannotAssignCustomer';
import { TooSoonToCreateAnotherTicketError } from '../../domain/errors/TooSoonToCreateAnotherTicket';
import { NotAllowedToAddThisTagError } from '../../domain/errors/NotAllowedToAddThisTag';
import { NotAllowedToRemoveThisTagError } from '../../domain/errors/NotAllowedToRemoveThisTag';
import { DuplicateTagError } from '../../domain/errors/DuplicateTag';
import { DuplicateAssigneeError } from '../../domain/errors/DuplicateAssignee';
import { NotAllowedToChangeToThisStatusError } from '../../domain/errors/NotAllowedToChangeToThisStatus';
import { CustomerCannotAddInternalCommmentError } from '../../domain/errors/CustomerCannotAddInternalComment';
import { NotAllowedToSearchOthersTicketsAsACustomerError } from '../../domain/errors/NotAllowedToSearchOthersTicketsAsACustomer';
import { BadTicketFiltersError } from '../../domain/errors/BadTicketFilters';
import { CommentNotFoundError } from '../../domain/errors/CommentNotFound';

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

        if (error instanceof BadTicketFiltersError) {
          throw new BadRequestException(error.getPayload());
        }

        if (error instanceof CommentNotFoundError) {
          throw new NotFoundException(error.getPayload());
        }

        if (error instanceof CannotChangeCommentsForTicketStatus) {
          throw new ConflictException(error.getPayload());
        }

        throw error;
      }),
    );
  }
}
