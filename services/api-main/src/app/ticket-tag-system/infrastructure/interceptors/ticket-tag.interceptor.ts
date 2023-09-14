import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { TicketTagGroupNotFoundError } from '../../domain/errors/TicketTagGroupNotFound';
import { TicketTagNameAlreadyExistsError } from '../../domain/errors/TicketTagNameAlreadyExists';
import { CannotRemoveAndAddOrUpdateTicketTagError } from '../../domain/errors/CannotRemoveAndAddOrUpdateTicketTag';
import { TicketTagNotFoundError } from '../../domain/errors/TicketTagNotFound';
import { TicketTagDuplicateNameError } from '../../domain/errors/TicketTagDuplicateName';
import { TicketTagGroupDuplicateNameError } from '../../domain/errors/TicketTagGroupDuplicateNameError';
import { OverlapInTagIdsError } from 'src/app/tickets/domain/errors/OverlapInTagIds';

@Injectable()
export class TicketTagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof TicketTagGroupNotFoundError) {
          throw new NotFoundException(error.getPayload());
        }

        if (error instanceof TicketTagNameAlreadyExistsError) {
          throw new BadRequestException(error.getPayload());
        }

        if (error instanceof CannotRemoveAndAddOrUpdateTicketTagError) {
          throw new BadRequestException(error.getPayload());
        }

        if (error instanceof TicketTagNotFoundError) {
          throw new NotFoundException(error.getPayload());
        }

        if (error instanceof TicketTagDuplicateNameError) {
          throw new ConflictException(error.getPayload());
        }

        if (error instanceof TicketTagGroupDuplicateNameError) {
          throw new ConflictException(error.getPayload());
        }

        if (error instanceof OverlapInTagIdsError) {
          throw new ConflictException(error.getPayload());
        }

        throw error;
      }),
    );
  }
}
