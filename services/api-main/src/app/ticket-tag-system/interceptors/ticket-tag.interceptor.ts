import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { TicketTagGroupNotFoundError } from '../errors/TicketTagGroupNotFound';
import { TicketTagNameAlreadyExistsError } from '../errors/TicketTagNameAlreadyExists';
import { CannotRemoveAndAddOrUpdateTicketTagError } from '../errors/CannotRemoveAndAddOrUpdateTicketTag';
import { TicketTagNotFoundError } from '../errors/TicketTagNotFound';
import { TicketTagDuplicateNameError } from '../errors/TicketTagDuplicateName';

@Injectable()
export class TicketTagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        console.log(error);
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
          throw new UnprocessableEntityException(error.getPayload());
        }

        throw error;
      }),
    );
  }
}
